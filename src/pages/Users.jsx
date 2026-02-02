import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import UserRow from "../components/users/UserRow";
import AddEditUserModal from "../components/users/AddEditUserModal";
import Pagination from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../hooks/useUsers";
import { useAuthStore } from "../stores/auth.store";
import { Plus, Loader2 } from "lucide-react";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const user = useAuthStore((state) => state.user);

  const { data: userData = { results: [], page: 1, limit: 10, totalPages: 1, totalResults: 0 }, isLoading, isError } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (formData) => {
    // Add restaurant name from current user to the payload
    const payloadData = {
      ...formData,
      restaurantName: user?.restaurantName
    };
    
    if (selectedUser) {
      updateMutation.mutate(
        { userId: selectedUser.id, data: payloadData },
        {
          onSuccess: () => {
            toast.success("User updated successfully!");
            handleCloseModal();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update user");
          },
        }
      );
    } else {
      createMutation.mutate(payloadData, {
        onSuccess: () => {
          toast.success("User created successfully!");
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create user");
        },
      });
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId, {
        onSuccess: () => {
          toast.success("User deleted successfully!");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete user");
        },
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Users</h2>
            <p className="text-slate-600 mt-1">Manage your team members</p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">Failed to load users</p>
            </div>
          ) : userData.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-600">No users found</p>
              <p className="text-slate-500 text-sm mt-1">
                Click "Add User" to create your first user
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {userData.results.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={userData.page}
                totalPages={userData.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={userData.limit}
                totalItems={userData.totalResults}
              />
            </>
          )}
        </div>
      </div>

      <AddEditUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={selectedUser}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </DashboardLayout>
  );
}