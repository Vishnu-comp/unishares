import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import api from '../../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState({ role: '', status: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditClick = () => {
    setEditData({
      role: selectedUser.role,
      status: selectedUser.status
    });
    setEditDialog(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/admin/users/${selectedUser._id}`, editData);
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, ...editData } : user
      ));
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip 
          icon={<AdminIcon />} 
          label="Admin" 
          color="error" 
          size="small" 
        />;
      case 'moderator':
        return <Chip 
          icon={<VerifyIcon />} 
          label="Moderator" 
          color="warning" 
          size="small" 
        />;
      default:
        return <Chip 
          icon={<UserIcon />} 
          label="User" 
          color="default" 
          size="small" 
        />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.default' }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.profileImage} alt={user.name}>
                        {user.name[0]}
                      </Avatar>
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="More Actions">
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon sx={{ mr: 1 }} /> Block User
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, width: 300 }}>
            <TextField
              select
              fullWidth
              label="Role"
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Status"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {!loading && filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No users found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UsersList; 