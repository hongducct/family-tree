import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { mockUsers } from '../data/mockData';

interface LoginFormProps {
  onLogin: (userId: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user.id);
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center">Gia Phả Việt</CardTitle>
          <CardDescription className="text-center">
            Đăng nhập để xem thông tin gia đình của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nguyen.van.a@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
            <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded space-y-2">
              <p className="mb-2">Tài khoản demo:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@example.com / 123456</p>
                <p><strong>Editor:</strong> editor@example.com / 123456</p>
                <p><strong>Member:</strong> member@example.com / 123456</p>
                <p><strong>Viewer:</strong> viewer@example.com / 123456</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
