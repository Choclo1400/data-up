
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, User, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/mode-toggle'
import { TwoFactorModal } from '@/components/auth/TwoFactorModal'

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [show2FAModal, setShow2FAModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 dark:text-red-400'
      case 'supervisor':
        return 'text-blue-600 dark:text-blue-400'
      case 'manager':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  // Mock 2FA handlers for now
  const handle2FAVerify = async (code: string): Promise<boolean> => {
    // Mock verification - always succeeds with code 123456
    return code === '123456'
  }

  const handle2FAResend = async (): Promise<void> => {
    // Mock resend
    console.log('Code resent')
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className={`text-xs leading-none capitalize ${getRoleColor(user.role)}`}>
                {user.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShow2FAModal(true)}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Autenticación 2FA</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TwoFactorModal 
        isOpen={show2FAModal} 
        onClose={() => setShow2FAModal(false)}
        onVerify={handle2FAVerify}
        onResendCode={handle2FAResend}
        method="2fa-email"
        loading={false}
      />
    </div>
  )
}

export default UserMenu
