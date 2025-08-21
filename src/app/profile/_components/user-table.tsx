
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    voiceProfileUrl: string | null;
}

interface UserTableProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export default function UserTable({ users, selectedUser, onSelectUser }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/> User Management</CardTitle>
        <CardDescription>Select a user from the table to view and manage their profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Voice Profile</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className={cn(
                        "cursor-pointer",
                        selectedUser?.id === user.id && "bg-muted hover:bg-muted"
                    )}
                >
                    <TableCell>
                        <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        {user.voiceProfileUrl ? (
                            <Badge variant="default">Complete</Badge>
                        ) : (
                            <Badge variant="secondary">Incomplete</Badge>
                        )}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
