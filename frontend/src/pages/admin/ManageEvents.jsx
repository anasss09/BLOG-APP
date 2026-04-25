import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEvents, updateEvent, createEvent } from "../../features/events/eventSlice";
import { toast } from "sonner";

export default function ManageEvents() {
  const dispatch = useDispatch();
  const { events, loading, creating, updating, deleting, error } = useSelector((state) => state.events);

  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    category: '',
    image: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // This ref prevents the useEffect from running twice
  // and stops navigate() from closing the dialog
  const handledRef = useRef(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  useEffect(() => {
    // Only run if we're coming back from the editor and haven't handled it yet
    if (
      location.state?.returnPath === "/admin/events" &&
      location.state?.description !== undefined &&
      !handledRef.current
    ) {
      handledRef.current = true; // mark as handled so navigate re-render doesn't re-run this

      const snap = location.state.formSnapshot || {};

      setFormData({
        ...snap,
        description: location.state.description,
        image: null // File objects can't be passed through state
      });

      setIsEditMode(location.state.isEditMode || false);

      if (location.state.isEditMode && location.state.currentPostId) {
        const found = events.find(e => e._id === location.state.currentPostId);
        if (found) setCurrentPost(found);
      }

      setOpen(true);

      // Clear location state without causing a re-render loop
      navigate("/admin/events", { replace: true, state: {} });
    }
  }, [location.state]);

  // Reset the ref when location state is cleared
  useEffect(() => {
    if (!location.state?.returnPath) {
      handledRef.current = false;
    }
  }, [location.state]);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (typeof image === 'object') return image.url;
    return null;
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setCurrentPost(null);
    setFormData({ title: '', description: '', location: '', eventDate: '', image: null });
    setUploadProgress(0);
    setOpen(true);
  };

  const handleEditClick = (post) => {
    setIsEditMode(true);
    setCurrentPost(post);
    setFormData({
      title: post.title || '',
      description: post.description || '',
      category: post.category || '',
      location: post.location || '',
      eventDate: post.eventDate ? new Date(post.eventDate).toISOString().split('T')[0] : '',
      image: null
    });
    setUploadProgress(0);
    setOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    setFormData(prev => ({ ...prev, image: file }));
    simulateUploadProgress();
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !formData.image) {
      toast.error("Image is required");
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category || "General");
    submitData.append('location', formData.location);
    submitData.append('eventDate', formData.eventDate);
    if (formData.image) submitData.append('image', formData.image);

    try {
      if (isEditMode && currentPost) {
        const resultAction = await dispatch(updateEvent({ id: currentPost._id, formData: submitData }));
        if (updateEvent.fulfilled.match(resultAction)) {
          setUploadProgress(100);
          setTimeout(() => { toast.success("Event updated successfully!"); setOpen(false); setUploadProgress(0); }, 500);
        } else {
          toast.error("Failed to update event");
        }
      } else {
        const resultAction = await dispatch(createEvent(submitData));
        if (createEvent.fulfilled.match(resultAction)) {
          setUploadProgress(100);
          setTimeout(() => { toast.success("Event created successfully!"); setOpen(false); setUploadProgress(0); }, 500);
        } else {
          toast.error("Failed to create event");
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setDeletingId(id);
      try {
        const resultAction = await dispatch(deleteEvent(id));
        if (deleteEvent.fulfilled.match(resultAction)) {
          toast.success("Event deleted successfully!");
        } else {
          toast.error("Failed to delete event");
        }
      } catch (error) {
        toast.error("An error occurred while deleting");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events Management</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick} className="flex items-center gap-2" disabled={creating || updating}>
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isEditMode ? 'Edit Event' : 'Create New Event'}
                {(creating || updating) && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title" name="title" value={formData.title}
                  onChange={handleInputChange} required
                  disabled={creating || updating} placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <div
                  onClick={() => navigate("/editor", {
                    state: {
                      description: formData.description,
                      returnPath: "/admin/events",
                      formSnapshot: { ...formData, image: null }, // File can't be serialized
                      isEditMode,
                      currentPostId: currentPost?._id
                    }
                  })}
                  className="border p-4 rounded cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {formData.description ? "Description added ✔ Click to edit" : "Click to write description"}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="conclave">Conclave</option>
                  <option value="roundtable">Roundtable</option>
                  <option value="track-ii">Track-II Dialogue</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date *</Label>
                  <Input
                    id="eventDate" name="eventDate" type="date"
                    value={formData.eventDate} onChange={handleInputChange}
                    required disabled={creating || updating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location" name="location" value={formData.location}
                    onChange={handleInputChange} required
                    disabled={creating || updating} placeholder="e.g. New York, NY"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="image" name="image" type="file"
                    accept="image/*" onChange={handleFileChange}
                    disabled={creating || updating}
                  />
                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  {currentPost?.image && !formData.image && (
                    <div className="mt-2 p-3 border rounded-md">
                      <p className="text-sm font-medium mb-2">Current Image:</p>
                      <img src={getImageUrl(currentPost.image)} alt="Current" className="w-16 h-16 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button" variant="outline"
                  onClick={() => { setOpen(false); setUploadProgress(0); }}
                  disabled={creating || updating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating || updating} className="min-w-24">
                  {creating || updating
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : (isEditMode ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Event</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-left font-semibold text-gray-700">Category</th>
              <th className="p-4 text-left font-semibold text-gray-700">Location</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && events.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" /></td></tr>
            ) : events?.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No events found</td></tr>
            ) : events?.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description?.substring(0, 60)}...</div>
                </td>
                <td className="p-4 text-gray-700">{new Date(item.eventDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {item.category || "General"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{item.location}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(item)} disabled={creating || updating || deletingId}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}