const ItemList = () => {
  const renderItemStatus = (item) => {
    const statusClasses = {
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      // ... other status classes
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusClasses[item.status]}`}>
        {item.status.replace('_', ' ').toUpperCase()}
        {item.moderationReason && (
          <span className="block text-xs mt-1">
            Reason: {item.moderationReason}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {items.map((item) => (
        <div key={item._id} className="border p-4 rounded-lg">
          {/* ... existing item details ... */}
          {isOwner(item) && renderItemStatus(item)}
          {/* ... rest of the item card ... */}
        </div>
 