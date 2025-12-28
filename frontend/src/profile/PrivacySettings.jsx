import { useEffect, useState } from "react";
import { getPrivacy, updatePrivacy } from "../services/profileApi";

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState(null);

  useEffect(() => {
    getPrivacy().then(res => setPrivacy(res.data));
  }, []);

  if (!privacy) return <p>Loading privacy settings...</p>;

  const toggle = key => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  const savePrivacy = async () => {
    await updatePrivacy(privacy);
    alert("Privacy updated 🔒");
  };

  return (
    <div>
      <h2>Privacy Settings</h2>

      <label>
        <input
          type="checkbox"
          checked={privacy.showLastSeen}
          onChange={() => toggle("showLastSeen")}
        />
        Show Last Seen
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={privacy.showProfilePhoto}
          onChange={() => toggle("showProfilePhoto")}
        />
        Show Profile Photo
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={privacy.readReceipts}
          onChange={() => toggle("readReceipts")}
        />
        Read Receipts
      </label>

      <br /><br />

      <button onClick={savePrivacy}>Save</button>
    </div>
  );
}
