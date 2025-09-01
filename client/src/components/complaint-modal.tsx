import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Complaint } from "@shared/schema";

interface ComplaintModalProps {
  complaint: Complaint;
  onClose: () => void;
  onMarkCompleted: (complaint: Complaint) => void;
  isDeleting: boolean;
}

export default function ComplaintModal({ complaint, onClose, onMarkCompleted, isDeleting }: ComplaintModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-testid="modal-complaint">
      <Card className="shadow-material-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-foreground">Complaint Details</h3>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-close-modal"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-material"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Complaint ID</label>
                <p className="text-foreground font-medium" data-testid="text-complaint-id">
                  #RO-{complaint.id.toString().padStart(3, '0')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                <p className="text-foreground" data-testid="text-location">
                  {complaint.location}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <p className="text-foreground" data-testid="text-name">
                  {complaint.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <p className="text-foreground" data-testid="text-phone">
                  {complaint.phone}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <p className="text-foreground bg-muted p-3 rounded-lg" data-testid="text-description">
                {complaint.description}
              </p>
            </div>
            
            {complaint.imagePath && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Uploaded Image</label>
                <img
                  src={complaint.imagePath}
                  alt="Complaint evidence"
                  data-testid="img-complaint"
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Submitted</label>
              <p className="text-foreground" data-testid="text-submitted-date">
                {complaint.createdAt ? formatDate(complaint.createdAt) : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button
              data-testid="button-mark-completed"
              onClick={() => onMarkCompleted(complaint)}
              disabled={isDeleting}
              className="bg-success text-success-foreground px-6 py-2 font-medium shadow-material hover:bg-success/90 transition-material"
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Mark as Completed
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              data-testid="button-close"
              onClick={onClose}
              className="px-6 py-2 font-medium shadow-material transition-material"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
