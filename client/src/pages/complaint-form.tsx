import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const complaintSchema = z.object({
  location: z.string().min(1, "Location is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.any().optional()
});

type ComplaintForm = z.infer<typeof complaintSchema>;

export default function ComplaintForm() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      description: "",
    }
  });

  // Auto-fill location from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    if (location) {
      form.setValue('location', decodeURIComponent(location));
    }
  }, [form]);

  const submitMutation = useMutation({
    mutationFn: async (data: ComplaintForm) => {
      const formData = new FormData();
      formData.append('location', data.location);
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('description', data.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit complaint');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully. We will address it soon.",
      });
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ComplaintForm) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-card shadow-material">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-hospital text-primary-foreground text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AIIMS</h1>
              <p className="text-sm text-muted-foreground">RO Plant Complaint System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-material-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8 text-center">
            <i className="fas fa-clipboard-list text-primary-foreground text-4xl mb-4"></i>
            <h2 className="text-2xl font-semibold text-primary-foreground mb-2">Submit RO Plant Complaint</h2>
            <p className="text-primary-foreground/80">Help us maintain water quality standards</p>
          </div>

          {/* Form Content */}
          <CardContent className="px-6 py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Location Field */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                        RO Plant Location
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            data-testid="input-location"
                            className="bg-muted text-muted-foreground font-medium cursor-not-allowed"
                          />
                        </FormControl>
                        <div className="absolute right-3 top-3">
                          <i className="fas fa-lock text-muted-foreground"></i>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Location automatically detected from QR code</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <i className="fas fa-user text-primary mr-2"></i>
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="input-name"
                          placeholder="Enter your full name"
                          className="focus:border-primary focus:ring-2 focus:ring-primary/20 transition-material"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <i className="fas fa-phone text-primary mr-2"></i>
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          data-testid="input-phone"
                          placeholder="Enter your phone number"
                          className="focus:border-primary focus:ring-2 focus:ring-primary/20 transition-material"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <i className="fas fa-comment-dots text-primary mr-2"></i>
                        Complaint Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          data-testid="textarea-description"
                          placeholder="Describe the issue with the RO plant (water taste, flow, cleanliness, etc.)"
                          className="focus:border-primary focus:ring-2 focus:ring-primary/20 transition-material resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div>
                  <FormLabel className="block text-sm font-medium text-foreground mb-2">
                    <i className="fas fa-camera text-primary mr-2"></i>
                    Upload Image (Optional)
                  </FormLabel>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="input-image"
                      className="hidden"
                      id="image-upload"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-material"
                    >
                      {selectedFile ? (
                        <div className="text-center">
                          <i className="fas fa-check-circle text-3xl text-success mb-2"></i>
                          <p className="text-sm font-medium text-success">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground mb-2"></i>
                          <p className="text-sm font-medium text-muted-foreground">Click to upload image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  data-testid="button-submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-primary text-primary-foreground py-4 px-6 font-semibold shadow-material hover:bg-primary/90 hover:shadow-material-lg transition-material"
                >
                  {submitMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 AIIMS. All rights reserved.</p>
          <Link href="/admin" className="text-primary hover:text-primary/80 mt-2 transition-material">
            Admin Login
          </Link>
        </div>
      </main>
    </div>
  );
}
