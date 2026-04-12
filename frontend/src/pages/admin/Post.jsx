import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "react-router-dom"
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2, Edit, Plus, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteResearch, fetchResearch, updateResearch, createResearch } from "../../features/research/researchSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"

export default function Posts() {
  const dispatch = useDispatch();
  const {
    blogs,
    loading,
    creating,
    updating,
    deleting,
    error
  } = useSelector((state) => state.research);

  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    featured: false
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate()
  const location = useLocation()

  // Fetch blogs on component mount
  useEffect(() => {
    dispatch(fetchResearch());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  // Decription
  useEffect(() => {

    if (location.state?.description) {

      setFormData(prev => ({
        ...prev,
        description: location.state.description
      }))

      setOpen(true) // dialog reopen

      navigate("/admin/posts", { replace: true }) // clear state

    }

  }, [location.state])

  // Helper function to safely extract author name
  const getAuthorName = (author) => {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.name || author.username || author.email || 'Unknown';
    }
    return 'Unknown';
  };

  // Category Option 
  const categories = [
    "Security & Geopolitics",
    "Trade & Economy",
    "AI & Emerging Technologies",
    "Climate Change & Sustainability",
    "Energy & Infrastructure",
    "Civilizational Studies",
    "Global Electoral Landscapes",
    "Multilateral Institutions"
  ];

  // Helper function to safely extract image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (typeof image === 'object') return image.url;
    return null;
  };

  // Handle create button click
  const handleCreateClick = () => {
    setIsEditMode(false);
    setCurrentPost(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      image: null
    });
    setUploadProgress(0);
    setOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (post) => {
    setIsEditMode(true);
    setCurrentPost(post);
    setFormData({
      title: post.title || '',
      description: post.description || '',
      category: post.category,
      image: null,
      featured: post.featured || false
    });
    setUploadProgress(0);
    setOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    simulateUploadProgress();
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !formData.image) {
      toast.error("Image is required");
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    // Note: Author is NOT sent - backend will use req.user.fullName
    submitData.append('featured', formData.featured);

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      if (isEditMode && currentPost) {
        // Update existing post
        const resultAction = await dispatch(updateResearch({
          id: currentPost._id,
          formData: submitData
        }));

        if (updateResearch.fulfilled.match(resultAction)) {
          setUploadProgress(100);
          setTimeout(() => {
            toast.success("Post updated successfully!");
            setOpen(false);
            setUploadProgress(0);
          }, 500);
        } else {
          toast.error("Failed to update post");
        }
      } else {
        // Create new post
        const resultAction = await dispatch(createResearch(submitData));

        if (createResearch.fulfilled.match(resultAction)) {
          setUploadProgress(100);
          setTimeout(() => {
            toast.success("Post created successfully!");
            setOpen(false);
            setUploadProgress(0);
          }, 500);
        } else {
          toast.error("Failed to create post");
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || "An error occurred");
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDeletingId(id);
      try {
        const resultAction = await dispatch(deleteResearch(id));

        if (deleteResearch.fulfilled.match(resultAction)) {
          toast.success("Post deleted successfully!");
        } else {
          toast.error("Failed to delete post");
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
        <h2 className="text-2xl font-bold">Research Posts</h2>

        {/* Create Post Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreateClick}
              className="flex items-center gap-2"
              disabled={creating || updating}
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isEditMode ? 'Edit Post' : 'Create New Post'}
                {(creating || updating) && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={creating || updating}
                  placeholder="Enter post title"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>

                <div
                  onClick={() =>
                    navigate("/editor", {
                      state: { description: formData.description }
                    })
                  }
                  className="border p-4 rounded cursor-pointer bg-gray-50 hover:bg-gray-100"
                >

                  {formData.description
                    ? "Description added ✔ Click to edit"
                    : "Click to write description"}

                </div>
              </div>

              {/* Category Input */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>

                {/* Category Dropdown */}
                <div className="space-y-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={creating || updating}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Select Category</option>

                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      featured: e.target.checked
                    }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={creating || updating}
                  />

                  {/* Upload Progress Indicator */}
                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading to Cloudinary...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                      {uploadProgress < 100 && (
                        <p className="text-xs text-gray-500">
                          Processing image, please wait...
                        </p>
                      )}
                      {uploadProgress === 100 && (
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Image uploaded successfully!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Current Image Preview (for edit mode) */}
                  {currentPost?.image && !formData.image && (
                    <div className="mt-2 p-3 border rounded-md">
                      <p className="text-sm font-medium mb-2">Current Image:</p>
                      <div className="flex items-center gap-3">
                        {getImageUrl(currentPost.image) && (
                          <img
                            src={getImageUrl(currentPost.image)}
                            alt="Current"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <span className="text-sm text-gray-600">
                          Keep empty to use current image
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setUploadProgress(0);
                  }}
                  disabled={creating || updating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || updating}
                  className="min-w-24"
                >
                  {creating || updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Post' : 'Create Post'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Title</th>
              <th className="p-4 text-left font-semibold text-gray-700">Author</th>
              <th className="p-4 text-left font-semibold text-gray-700">Image</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading State */}
            {loading && blogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-gray-600">Loading posts...</p>
                  </div>
                </td>
              </tr>
            ) :

              /* Empty State */
              blogs?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600">No posts found</p>
                      <p className="text-sm text-gray-500">Create your first post to get started</p>
                    </div>
                  </td>
                </tr>
              ) :

                /* Posts List */
                blogs?.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{post.title || 'Untitled'}</div>
                      {post.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {post.description.substring(0, 60)}...
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{getAuthorName(post.author)}</div>
                    </td>
                    <td className="p-4">
                      {getImageUrl(post.image) ? (
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(post)}
                          disabled={creating || updating || deletingId}
                          className="flex items-center gap-1.5"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id || creating || updating}
                          className="flex items-center gap-1.5"
                        >
                          {deletingId === post._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          {deletingId === post._id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Global Loading Indicator */}
      {(deleting || creating || updating) && blogs.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm">
            {deleting ? 'Deleting...' : creating ? 'Creating...' : 'Updating...'}
          </span>
        </div>
      )}
    </div>
  );
}