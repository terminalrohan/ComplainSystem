import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ComplaintModal from "@/components/complaint-modal";
import type { Complaint } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Check if admin is authenticated
  const { data: adminData, isLoading: authLoading, error: authError } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  // Fetch complaints
  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ['/api/complaints'],
    enabled: !!adminData,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/admin');
    },
  });

  // Delete complaint mutation
  const deleteComplaintMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete complaint');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      setSelectedComplaint(null);
      toast({
        title: "Complaint Completed",
        description: "The complaint has been marked as completed and removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!adminData || authError)) {
      setLocation('/admin');
    }
  }, [adminData, authLoading, authError, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return null;
  }

  const handleMarkCompleted = (complaint: Complaint) => {
    if (window.confirm('Are you sure you want to mark this complaint as completed? This action cannot be undone.')) {
      deleteComplaintMutation.mutate(complaint.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      relative: getRelativeTime(date),
      absolute: date.toLocaleDateString()
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card shadow-material border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-hospital text-primary-foreground text-sm"></i>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">AIIMS Admin Dashboard</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Administrator
              </div>
              <Button
                variant="ghost"
                size="sm"
                data-testid="button-logout"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-muted-foreground hover:text-foreground transition-material"
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <Card className="shadow-material">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary/10">
                  <i className="fas fa-exclamation-circle text-primary text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Complaints</p>
                  <p className="text-2xl font-semibold text-foreground" data-testid="text-active-complaints">
                    {complaints.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints Table */}
        <Card className="shadow-material overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Active Complaints</h2>
          </div>
          
          {complaintsLoading ? (
            <CardContent className="p-6 text-center">
              <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
              <p>Loading complaints...</p>
            </CardContent>
          ) : complaints.length === 0 ? (
            <CardContent className="p-6 text-center">
              <i className="fas fa-clipboard-list text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No active complaints</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Complaint ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {complaints.map((complaint) => {
                    const dateInfo = formatDate(complaint.createdAt!);
                    return (
                      <tr key={complaint.id} className="hover:bg-muted/50 transition-material" data-testid={`row-complaint-${complaint.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          #RO-{complaint.id.toString().padStart(3, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                          {complaint.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-foreground">{complaint.name}</div>
                            <div className="text-sm text-muted-foreground">{complaint.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {complaint.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <div>{dateInfo.relative}</div>
                          <div className="text-xs">{dateInfo.absolute}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-${complaint.id}`}
                            onClick={() => setSelectedComplaint(complaint)}
                            className="text-primary hover:text-primary/80 transition-material"
                          >
                            <i className="fas fa-eye mr-1"></i>View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-complete-${complaint.id}`}
                            onClick={() => handleMarkCompleted(complaint)}
                            disabled={deleteComplaintMutation.isPending}
                            className="text-success hover:text-success/80 transition-material ml-3"
                          >
                            <i className="fas fa-check mr-1"></i>Complete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Complaint Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onMarkCompleted={handleMarkCompleted}
          isDeleting={deleteComplaintMutation.isPending}
        />
      )}
    </div>
  );
}
