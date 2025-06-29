/**
 * Performance Testing Script
 * 
 * Compares performance between MongoDB and Supabase implementations
 */

import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'
import { performance } from 'perf_hooks'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_servicios'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const mongoClient = new MongoClient(MONGODB_URI)

class PerformanceTester {
  constructor() {
    this.results = []
  }

  async measureTime(name, fn) {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    const duration = end - start
    
    console.log(`${name}: ${duration.toFixed(2)}ms`)
    
    this.results.push({
      test: name,
      duration: duration,
      timestamp: new Date().toISOString()
    })
    
    return result
  }

  async testMongoDB() {
    console.log('\n=== MongoDB Performance Tests ===')
    
    await mongoClient.connect()
    const db = mongoClient.db()
    
    // Test 1: Simple query
    await this.measureTime('MongoDB - Find all users', async () => {
      return await db.collection('users').find({}).toArray()
    })
    
    // Test 2: Complex query with aggregation
    await this.measureTime('MongoDB - Requests with client info', async () => {
      return await db.collection('requests').aggregate([
        {
          $lookup: {
            from: 'clients',
            localField: 'clientId',
            foreignField: '_id',
            as: 'client'
          }
        },
        { $limit: 100 }
      ]).toArray()
    })
    
    // Test 3: Count query
    await this.measureTime('MongoDB - Count active users', async () => {
      return await db.collection('users').countDocuments({ isActive: true })
    })
    
    // Test 4: Insert operation
    await this.measureTime('MongoDB - Insert test user', async () => {
      const result = await db.collection('users').insertOne({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'technician',
        isActive: true,
        createdAt: new Date()
      })
      
      // Clean up
      await db.collection('users').deleteOne({ _id: result.insertedId })
      return result
    })
    
    await mongoClient.close()
  }

  async testSupabase() {
    console.log('\n=== Supabase Performance Tests ===')
    
    // Test 1: Simple query
    await this.measureTime('Supabase - Find all users', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
      
      if (error) throw error
      return data
    })
    
    // Test 2: Complex query with join
    await this.measureTime('Supabase - Requests with client info', async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          clients (
            id,
            name,
            email,
            type
          )
        `)
        .limit(100)
      
      if (error) throw error
      return data
    })
    
    // Test 3: Count query
    await this.measureTime('Supabase - Count active users', async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      if (error) throw error
      return count
    })
    
    // Test 4: Insert operation
    await this.measureTime('Supabase - Insert test user', async () => {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        password_hash: 'test-hash',
        name: 'Test User',
        role: 'technician',
        is_active: true
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single()
      
      if (error) throw error
      
      // Clean up
      await supabase
        .from('users')
        .delete()
        .eq('id', data.id)
      
      return data
    })
  }

  async testRealTimeFeatures() {
    console.log('\n=== Real-time Features Test ===')
    
    await this.measureTime('Supabase - Real-time subscription setup', async () => {
      return new Promise((resolve) => {
        const subscription = supabase
          .channel('test-channel')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notifications'
          }, (payload) => {
            console.log('Real-time event received:', payload)
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              subscription.unsubscribe()
              resolve(status)
            }
          })
      })
    })
  }

  async generateReport() {
    const mongoResults = this.results.filter(r => r.test.includes('MongoDB'))
    const supabaseResults = this.results.filter(r => r.test.includes('Supabase'))
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        mongodb_avg: mongoResults.reduce((sum, r) => sum + r.duration, 0) / mongoResults.length,
        supabase_avg: supabaseResults.reduce((sum, r) => sum + r.duration, 0) / supabaseResults.length,
        total_tests: this.results.length
      },
      detailed_results: this.results,
      comparison: this.results.reduce((acc, result) => {
        const testName = result.test.replace(/^(MongoDB|Supabase) - /, '')
        if (!acc[testName]) {
          acc[testName] = {}
        }
        
        if (result.test.includes('MongoDB')) {
          acc[testName].mongodb = result.duration
        } else if (result.test.includes('Supabase')) {
          acc[testName].supabase = result.duration
        }
        
        if (acc[testName].mongodb && acc[testName].supabase) {
          acc[testName].difference = acc[testName].supabase - acc[testName].mongodb
          acc[testName].percentage_change = ((acc[testName].supabase - acc[testName].mongodb) / acc[testName].mongodb * 100).toFixed(2)
        }
        
        return acc
      }, {})
    }
    
    console.log('\n=== Performance Summary ===')
    console.log(`MongoDB Average: ${report.summary.mongodb_avg.toFixed(2)}ms`)
    console.log(`Supabase Average: ${report.summary.supabase_avg.toFixed(2)}ms`)
    
    console.log('\n=== Detailed Comparison ===')
    Object.entries(report.comparison).forEach(([test, data]) => {
      if (data.mongodb && data.supabase) {
        const faster = data.supabase < data.mongodb ? 'Supabase' : 'MongoDB'
        console.log(`${test}:`)
        console.log(`  MongoDB: ${data.mongodb.toFixed(2)}ms`)
        console.log(`  Supabase: ${data.supabase.toFixed(2)}ms`)
        console.log(`  ${faster} is faster by ${Math.abs(data.difference).toFixed(2)}ms (${Math.abs(data.percentage_change)}%)`)
      }
    })
    
    // Save report to file
    await import('fs/promises').then(fs => 
      fs.writeFile('performance-report.json', JSON.stringify(report, null, 2))
    )
    
    console.log('\nPerformance report saved to performance-report.json')
    return report
  }

  async runTests() {
    console.log('Starting performance tests...')
    
    try {
      await this.testMongoDB()
      await this.testSupabase()
      await this.testRealTimeFeatures()
      
      await this.generateReport()
      
      console.log('\n✅ Performance tests completed successfully!')
      
    } catch (error) {
      console.error('Performance tests failed:', error)
      throw error
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PerformanceTester()
  tester.runTests().catch(console.error)
}

export default PerformanceTester