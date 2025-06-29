/**
 * MongoDB to Supabase Data Migration Script
 * 
 * This script handles the migration of data from MongoDB to Supabase PostgreSQL
 * Run this script after setting up the Supabase schema
 */

import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'
import fs from 'fs/promises'
import path from 'path'

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_servicios'

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const mongoClient = new MongoClient(MONGODB_URI)

// Utility functions
const generateUUID = () => crypto.randomUUID()

const transformObjectId = (obj, idMap = new Map()) => {
  if (!obj) return obj
  
  if (typeof obj === 'object' && obj._id) {
    const newId = idMap.get(obj._id.toString()) || generateUUID()
    idMap.set(obj._id.toString(), newId)
    return newId
  }
  
  return obj
}

const transformDocument = (doc, idMap) => {
  if (!doc) return null
  
  const transformed = { ...doc }
  
  // Transform _id to id
  if (transformed._id) {
    transformed.id = transformObjectId(transformed, idMap)
    delete transformed._id
  }
  
  // Transform __v (version key)
  if (transformed.__v !== undefined) {
    delete transformed.__v
  }
  
  // Transform dates
  Object.keys(transformed).forEach(key => {
    if (transformed[key] instanceof Date) {
      transformed[key] = transformed[key].toISOString()
    }
  })
  
  return transformed
}

class DataMigrator {
  constructor() {
    this.idMaps = {
      users: new Map(),
      clients: new Map(),
      requests: new Map()
    }
    this.migrationLog = []
  }

  async connect() {
    await mongoClient.connect()
    console.log('Connected to MongoDB')
  }

  async disconnect() {
    await mongoClient.close()
    console.log('Disconnected from MongoDB')
  }

  async logMigration(collection, action, count, errors = []) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      collection,
      action,
      count,
      errors
    }
    this.migrationLog.push(logEntry)
    console.log(`${collection}: ${action} - ${count} records${errors.length ? ` (${errors.length} errors)` : ''}`)
  }

  async migrateUsers() {
    const db = mongoClient.db()
    const users = await db.collection('users').find({}).toArray()
    
    const transformedUsers = users.map(user => {
      const transformed = transformDocument(user, this.idMaps.users)
      
      // Transform MongoDB specific fields to PostgreSQL
      return {
        id: transformed.id,
        email: transformed.email,
        password_hash: transformed.password, // Assuming password is already hashed
        name: transformed.name,
        role: transformed.role,
        is_active: transformed.isActive !== false,
        two_factor_secret: transformed.twoFactorSecret || null,
        two_factor_enabled: transformed.twoFactorEnabled || false,
        last_login: transformed.lastLogin || null,
        created_at: transformed.createdAt || new Date().toISOString(),
        updated_at: transformed.updatedAt || new Date().toISOString()
      }
    })

    const errors = []
    let successCount = 0

    for (const user of transformedUsers) {
      try {
        const { error } = await supabase
          .from('users')
          .insert(user)
        
        if (error) {
          errors.push({ user: user.email, error: error.message })
        } else {
          successCount++
        }
      } catch (err) {
        errors.push({ user: user.email, error: err.message })
      }
    }

    await this.logMigration('users', 'migrated', successCount, errors)
    return { success: successCount, errors }
  }

  async migrateClients() {
    const db = mongoClient.db()
    const clients = await db.collection('clients').find({}).toArray()
    
    const transformedClients = clients.map(client => {
      const transformed = transformDocument(client, this.idMaps.clients)
      
      return {
        id: transformed.id,
        name: transformed.name,
        email: transformed.email || null,
        phone: transformed.phone || null,
        address: transformed.address || null,
        type: transformed.type,
        contact_person: transformed.contactPerson || null,
        is_active: transformed.isActive !== false,
        created_at: transformed.createdAt || new Date().toISOString(),
        updated_at: transformed.updatedAt || new Date().toISOString()
      }
    })

    const errors = []
    let successCount = 0

    for (const client of transformedClients) {
      try {
        const { error } = await supabase
          .from('clients')
          .insert(client)
        
        if (error) {
          errors.push({ client: client.name, error: error.message })
        } else {
          successCount++
        }
      } catch (err) {
        errors.push({ client: client.name, error: err.message })
      }
    }

    await this.logMigration('clients', 'migrated', successCount, errors)
    return { success: successCount, errors }
  }

  async migrateRequests() {
    const db = mongoClient.db()
    const requests = await db.collection('requests').find({}).toArray()
    
    const transformedRequests = requests.map(request => {
      const transformed = transformDocument(request, this.idMaps.requests)
      
      return {
        id: transformed.id,
        client_id: this.idMaps.clients.get(transformed.clientId?.toString()) || null,
        service_type: transformed.serviceType,
        description: transformed.description,
        priority: transformed.priority,
        status: transformed.status,
        assigned_technician_id: this.idMaps.users.get(transformed.assignedTechnician?.toString()) || null,
        approved_by_id: this.idMaps.users.get(transformed.approvedBy?.toString()) || null,
        scheduled_date: transformed.scheduledDate || null,
        completed_date: transformed.completedDate || null,
        estimated_cost: transformed.estimatedCost || null,
        actual_cost: transformed.actualCost || null,
        materials: JSON.stringify(transformed.materials || []),
        notes: transformed.notes || null,
        attachments: JSON.stringify(transformed.attachments || []),
        created_at: transformed.createdAt || new Date().toISOString(),
        updated_at: transformed.updatedAt || new Date().toISOString()
      }
    })

    const errors = []
    let successCount = 0

    for (const request of transformedRequests) {
      try {
        const { error } = await supabase
          .from('service_requests')
          .insert(request)
        
        if (error) {
          errors.push({ request: request.id, error: error.message })
        } else {
          successCount++
        }
      } catch (err) {
        errors.push({ request: request.id, error: err.message })
      }
    }

    await this.logMigration('service_requests', 'migrated', successCount, errors)
    return { success: successCount, errors }
  }

  async migrateAuditLogs() {
    const db = mongoClient.db()
    const auditLogs = await db.collection('auditlogs').find({}).toArray()
    
    const transformedLogs = auditLogs.map(log => {
      const transformed = transformDocument(log, new Map())
      
      return {
        id: transformed.id,
        user_id: this.idMaps.users.get(transformed.userId?.toString()) || null,
        action: transformed.action,
        resource: transformed.resource,
        resource_id: transformed.resourceId || null,
        details: JSON.stringify(transformed.details || {}),
        ip_address: transformed.ipAddress || null,
        user_agent: transformed.userAgent || null,
        timestamp: transformed.timestamp || new Date().toISOString()
      }
    })

    const errors = []
    let successCount = 0

    for (const log of transformedLogs) {
      try {
        const { error } = await supabase
          .from('audit_logs')
          .insert(log)
        
        if (error) {
          errors.push({ log: log.id, error: error.message })
        } else {
          successCount++
        }
      } catch (err) {
        errors.push({ log: log.id, error: err.message })
      }
    }

    await this.logMigration('audit_logs', 'migrated', successCount, errors)
    return { success: successCount, errors }
  }

  async migrateNotifications() {
    const db = mongoClient.db()
    const notifications = await db.collection('notifications').find({}).toArray()
    
    const transformedNotifications = notifications.map(notification => {
      const transformed = transformDocument(notification, new Map())
      
      return {
        id: transformed.id,
        user_id: this.idMaps.users.get(transformed.userId?.toString()) || null,
        title: transformed.title,
        message: transformed.message,
        type: transformed.type,
        is_read: transformed.isRead || false,
        created_at: transformed.createdAt || new Date().toISOString()
      }
    })

    const errors = []
    let successCount = 0

    for (const notification of transformedNotifications) {
      try {
        const { error } = await supabase
          .from('notifications')
          .insert(notification)
        
        if (error) {
          errors.push({ notification: notification.id, error: error.message })
        } else {
          successCount++
        }
      } catch (err) {
        errors.push({ notification: notification.id, error: err.message })
      }
    }

    await this.logMigration('notifications', 'migrated', successCount, errors)
    return { success: successCount, errors }
  }

  async saveMigrationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.migrationLog,
      idMappings: {
        users: Object.fromEntries(this.idMaps.users),
        clients: Object.fromEntries(this.idMaps.clients),
        requests: Object.fromEntries(this.idMaps.requests)
      }
    }

    await fs.writeFile(
      path.join(process.cwd(), 'migration-report.json'),
      JSON.stringify(report, null, 2)
    )

    console.log('Migration report saved to migration-report.json')
  }

  async runFullMigration() {
    console.log('Starting MongoDB to Supabase migration...')
    
    try {
      await this.connect()
      
      // Migrate in order of dependencies
      console.log('\n1. Migrating users...')
      await this.migrateUsers()
      
      console.log('\n2. Migrating clients...')
      await this.migrateClients()
      
      console.log('\n3. Migrating service requests...')
      await this.migrateRequests()
      
      console.log('\n4. Migrating audit logs...')
      await this.migrateAuditLogs()
      
      console.log('\n5. Migrating notifications...')
      await this.migrateNotifications()
      
      await this.saveMigrationReport()
      
      console.log('\nMigration completed successfully!')
      
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    } finally {
      await this.disconnect()
    }
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migrator = new DataMigrator()
  migrator.runFullMigration().catch(console.error)
}

export default DataMigrator