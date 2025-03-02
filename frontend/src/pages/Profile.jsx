export function Profile({ user }) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.profileImage && <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full" />}
      </div>
    );
  }
  