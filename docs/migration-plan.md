# MongoDB to Supabase Migration Plan

## 1. Initial Assessment

### Current Database Schema Analysis

Based on the existing MongoDB models, here's the current schema structure:

#### MongoDB Collections:

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: 'admin', 'manager', 'supervisor', 'technician', 'operator'),
  isActive: Boolean,
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Clients Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  type: String (enum: 'individual', 'company'),
  contactPerson: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Requests Collection:**
```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: Client),
  serviceType: String,
  description: String,
  priority: String (enum: 'low', 'medium', 'high', 'urgent'),
  status: String (enum: 'pending', 'approved', 'in_progress', 'completed', 'cancelled'),
  assignedTechnician: ObjectId (ref: User),
  approvedBy: ObjectId (ref: User),
  scheduledDate: Date,
  completedDate: Date,
  estimatedCost: Number,
  actualCost: Number,
  materials: Array,
  notes: String,
  attachments: Array,
  createdAt: Date,
  updatedAt: Date
}
```

**AuditLog Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: String,
  resource: String,
  resourceId: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

**Notifications Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  message: String,
  type: String (enum: 'info', 'warning', 'error', 'success'),
  isRead: Boolean,
  createdAt: Date
}
```

### Data Type Mapping

| MongoDB Type | PostgreSQL Type | Notes |
|--------------|-----------------|-------|
| ObjectId | UUID | Use gen_random_uuid() |
| String | TEXT/VARCHAR | Depending on length constraints |
| Number | NUMERIC/INTEGER | Based on precision needs |
| Boolean | BOOLEAN | Direct mapping |
| Date | TIMESTAMPTZ | With timezone support |
| Array | JSONB | For complex arrays |
| Object | JSONB | For nested documents |

### Application Components Analysis

**Frontend Components Affected:**
- Authentication system (AuthContext, login/register)
- All CRUD operations (Users, Clients, Requests)
- Real-time notifications
- Audit logging
- File uploads/attachments
- Reporting and analytics

**Backend Services to Replace:**
- MongoDB connection and models
- Authentication middleware
- API endpoints
- Real-time notifications
- File handling services

## 2. Migration Strategy

### Target Supabase Schema Design

#### Core Tables Structure:

```sql
-- Users table with RLS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'supervisor', 'technician', 'operator')),
  is_active BOOLEAN DEFAULT true,
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  type TEXT NOT NULL CHECK (type IN ('individual', 'company')),
  contact_person TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service requests table
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
  assigned_technician_id UUID REFERENCES users(id),
  approved_by_id UUID REFERENCES users(id),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  materials JSONB DEFAULT '[]',
  notes TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Step-by-Step Migration Sequence

#### Phase 1: Environment Setup (Day 1)
1. Set up Supabase project
2. Configure environment variables
3. Create database schema
4. Set up Row Level Security policies
5. Configure authentication

#### Phase 2: Data Export and Transformation (Day 2-3)
1. Export MongoDB data to JSON files
2. Transform data format (ObjectId to UUID)
3. Validate data integrity
4. Create data import scripts

#### Phase 3: Application Code Updates (Day 4-7)
1. Update database connection configuration
2. Replace MongoDB queries with Supabase SDK calls
3. Update authentication system
4. Modify API endpoints
5. Update frontend services

#### Phase 4: Testing and Validation (Day 8-10)
1. Run comprehensive tests
2. Validate data integrity
3. Performance testing
4. User acceptance testing

#### Phase 5: Production Migration (Day 11)
1. Final data sync
2. Switch DNS/routing
3. Monitor system performance
4. Rollback procedures if needed

### Rollback Procedures

**Immediate Rollback (< 1 hour):**
1. Revert DNS/routing to MongoDB backend
2. Restore MongoDB from backup
3. Restart original services

**Extended Rollback (> 1 hour):**
1. Export recent data from Supabase
2. Merge with MongoDB backup
3. Validate data consistency
4. Full system restart

### Success Criteria

- [ ] All data successfully migrated with 100% integrity
- [ ] All application features working correctly
- [ ] Performance meets or exceeds current benchmarks
- [ ] Zero data loss during migration
- [ ] All users can authenticate and access their data
- [ ] Real-time features functioning properly

## 3. Implementation Details

### Supabase Connection Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### Environment Variables Required

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Query Updates

**Before (MongoDB/Mongoose):**
```javascript
// Find users
const users = await User.find({ isActive: true });

// Create request
const request = new Request({
  clientId,
  serviceType,
  description,
  priority
});
await request.save();
```

**After (Supabase):**
```typescript
// Find users
const { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('is_active', true);

// Create request
const { data: request, error } = await supabase
  .from('service_requests')
  .insert({
    client_id: clientId,
    service_type: serviceType,
    description,
    priority
  })
  .select()
  .single();
```

### Authentication System Updates

**Supabase Auth Integration:**
```typescript
// src/contexts/AuthContext.tsx
import { supabase } from '@/lib/supabase'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Row Level Security Policies

```sql
-- Users can only read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Managers can read all users
CREATE POLICY "Managers can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Service requests policies
CREATE POLICY "Users can read assigned requests" ON service_requests
  FOR SELECT USING (
    assigned_technician_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'supervisor')
    )
  );
```

### Real-time Subscriptions

```typescript
// Real-time notifications
useEffect(() => {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [user.id])
```

## 4. Testing Protocol

### Data Integrity Verification

**Test Cases:**
1. **User Data Migration**
   - Verify all users migrated with correct roles
   - Validate password hashes are preserved
   - Check 2FA settings maintained

2. **Relational Data Integrity**
   - Verify all foreign key relationships
   - Check cascade deletes work correctly
   - Validate JSONB data structure

3. **Authentication Testing**
   - Test login with existing credentials
   - Verify role-based access control
   - Test 2FA functionality

4. **Real-time Features**
   - Test notification delivery
   - Verify real-time updates
   - Check subscription cleanup

### Performance Benchmarks

**Metrics to Compare:**
- Query response times
- Concurrent user capacity
- Real-time message latency
- File upload/download speeds

**Target Performance:**
- API response time: < 200ms (95th percentile)
- Database query time: < 100ms (average)
- Real-time latency: < 50ms
- File upload: > 10MB/s

### User Acceptance Testing

**Test Scenarios:**
1. Complete user workflow (login → create request → approval → completion)
2. Manager approval workflows
3. Technician assignment and updates
4. Notification system functionality
5. Reporting and analytics features

### Monitoring and Logging

**During Migration:**
- Real-time error monitoring
- Performance metrics tracking
- User activity logging
- Data consistency checks

**Post-Migration:**
- Application performance monitoring
- Database query performance
- User session tracking
- Error rate monitoring

## 5. Risk Mitigation

### High-Risk Areas

1. **Data Loss Prevention**
   - Multiple backup points
   - Incremental migration approach
   - Real-time validation

2. **Authentication Issues**
   - Parallel authentication testing
   - Gradual user migration
   - Fallback mechanisms

3. **Performance Degradation**
   - Load testing before migration
   - Database optimization
   - CDN configuration

### Contingency Plans

1. **Immediate Issues (0-1 hour)**
   - Automated rollback triggers
   - Health check monitoring
   - Alert system activation

2. **Extended Issues (1-24 hours)**
   - Manual intervention procedures
   - Data reconciliation scripts
   - User communication plan

## 6. Timeline and Resources

### Migration Timeline (11 days)

**Week 1:**
- Days 1-3: Setup and data preparation
- Days 4-7: Code migration and testing

**Week 2:**
- Days 8-10: Comprehensive testing
- Day 11: Production migration

### Required Resources

**Technical Team:**
- 1 Database specialist (full-time)
- 2 Backend developers (full-time)
- 1 Frontend developer (part-time)
- 1 DevOps engineer (part-time)

**Infrastructure:**
- Supabase Pro plan
- Staging environment
- Monitoring tools
- Backup storage

## 7. Post-Migration Tasks

### Immediate (Week 1)
- Monitor system performance
- Address any critical issues
- User feedback collection
- Performance optimization

### Short-term (Month 1)
- Optimize database queries
- Fine-tune RLS policies
- Implement additional monitoring
- User training and documentation

### Long-term (Month 2-3)
- Advanced analytics setup
- Performance improvements
- Feature enhancements
- Cost optimization

This comprehensive migration plan ensures a smooth transition from MongoDB to Supabase while maintaining data integrity and minimizing downtime. The phased approach allows for thorough testing and validation at each step.