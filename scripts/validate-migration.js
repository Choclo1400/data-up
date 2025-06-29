/**
 * Migration Validation Script
 * 
 * Validates data integrity after migration from MongoDB to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'
import fs from 'fs/promises'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_servicios'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const mongoClient = new MongoClient(MONGODB_URI)

class MigrationValidator {
  constructor() {
    this.validationResults = []
  }

  async validateCounts() {
    console.log('Validating record counts...')
    
    await mongoClient.connect()
    const db = mongoClient.db()
    
    const collections = ['users', 'clients', 'requests', 'auditlogs', 'notifications']
    const tables = ['users', 'clients', 'service_requests', 'audit_logs', 'notifications']
    
    for (let i = 0; i < collections.length; i++) {
      const mongoCount = await db.collection(collections[i]).countDocuments()
      const { count: supabaseCount } = await supabase
        .from(tables[i])
        .select('*', { count: 'exact', head: true })
      
      const isValid = mongoCount === supabaseCount
      
      this.validationResults.push({
        test: `${collections[i]}_count`,
        expected: mongoCount,
        actual: supabaseCount,
        passed: isValid
      })
      
      console.log(`${collections[i]}: MongoDB=${mongoCount}, Supabase=${supabaseCount} ${isValid ? '✓' : '✗'}`)
    }
    
    await mongoClient.close()
  }

  async validateDataIntegrity() {
    console.log('Validating data integrity...')
    
    // Sample validation - check if all users have required fields
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching users:', error)
      return
    }
    
    const invalidUsers = users.filter(user => 
      !user.email || !user.name || !user.role
    )
    
    this.validationResults.push({
      test: 'users_required_fields',
      expected: 0,
      actual: invalidUsers.length,
      passed: invalidUsers.length === 0,
      details: invalidUsers.map(u => u.id)
    })
    
    console.log(`Users with missing required fields: ${invalidUsers.length} ${invalidUsers.length === 0 ? '✓' : '✗'}`)
  }

  async validateRelationships() {
    console.log('Validating relationships...')
    
    // Check service_requests -> clients relationship
    const { data: requestsWithoutClients } = await supabase
      .from('service_requests')
      .select('id, client_id')
      .is('client_id', null)
    
    // Check service_requests -> users (technician) relationship
    const { data: requestsWithInvalidTechnicians } = await supabase
      .from('service_requests')
      .select(`
        id, 
        assigned_technician_id,
        users!service_requests_assigned_technician_id_fkey(id)
      `)
      .not('assigned_technician_id', 'is', null)
      .is('users.id', null)
    
    this.validationResults.push({
      test: 'requests_without_clients',
      expected: 0,
      actual: requestsWithoutClients?.length || 0,
      passed: (requestsWithoutClients?.length || 0) === 0
    })
    
    this.validationResults.push({
      test: 'requests_invalid_technicians',
      expected: 0,
      actual: requestsWithInvalidTechnicians?.length || 0,
      passed: (requestsWithInvalidTechnicians?.length || 0) === 0
    })
    
    console.log(`Requests without valid clients: ${requestsWithoutClients?.length || 0}`)
    console.log(`Requests with invalid technicians: ${requestsWithInvalidTechnicians?.length || 0}`)
  }

  async validateConstraints() {
    console.log('Validating constraints...')
    
    // Check for duplicate emails
    const { data: duplicateEmails } = await supabase
      .from('users')
      .select('email')
      .not('email', 'is', null)
    
    const emailCounts = {}
    duplicateEmails?.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1
    })
    
    const duplicates = Object.entries(emailCounts).filter(([_, count]) => count > 1)
    
    this.validationResults.push({
      test: 'unique_emails',
      expected: 0,
      actual: duplicates.length,
      passed: duplicates.length === 0,
      details: duplicates.map(([email, count]) => ({ email, count }))
    })
    
    console.log(`Duplicate emails: ${duplicates.length} ${duplicates.length === 0 ? '✓' : '✗'}`)
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: this.validationResults.length,
        passed: this.validationResults.filter(r => r.passed).length,
        failed: this.validationResults.filter(r => !r.passed).length
      },
      results: this.validationResults
    }
    
    await fs.writeFile(
      'validation-report.json',
      JSON.stringify(report, null, 2)
    )
    
    console.log('\nValidation Summary:')
    console.log(`Total tests: ${report.summary.total_tests}`)
    console.log(`Passed: ${report.summary.passed}`)
    console.log(`Failed: ${report.summary.failed}`)
    console.log('\nValidation report saved to validation-report.json')
    
    return report.summary.failed === 0
  }

  async runValidation() {
    console.log('Starting migration validation...\n')
    
    try {
      await this.validateCounts()
      await this.validateDataIntegrity()
      await this.validateRelationships()
      await this.validateConstraints()
      
      const allPassed = await this.generateReport()
      
      if (allPassed) {
        console.log('\n✅ All validation tests passed!')
        return true
      } else {
        console.log('\n❌ Some validation tests failed. Check validation-report.json for details.')
        return false
      }
      
    } catch (error) {
      console.error('Validation failed:', error)
      return false
    }
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new MigrationValidator()
  validator.runValidation()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

export default MigrationValidator