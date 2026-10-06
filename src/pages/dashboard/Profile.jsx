import Heading from "../../components/ui/Heading.jsx";
import Text from "../../components/ui/Text.jsx";
import Logo from "../../components/Logo.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { structuredUserData } from "../../utils/data.js";

function Profile() {
  const { user } = useAuth();
  const [surname, ...rest] = (user?.name || "").split(" ");
  const otherNames = rest.join(" ");

  const infoRows = [
    { label: "Surname", value: surname },
    { label: "Other Names", value: otherNames },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Account Number", value: user?.accountNumber },
    { label: "Account Type", value: user?.accountType },
  ];

  const structuredUser = structuredUserData.find(
    (item) => item.accountNumber === user?.accountNumber,
  );

  const profileImage = user?.profilePictureUrl || structuredUser?.image;

  return (
    <div>
      <Heading level={1} size="md">
        Profile
      </Heading>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border border-text-secondary/15 lg:col-span-2">
          <div className="flex items-center justify-center bg-surface px-6 py-10">
            <Logo className="h-12" />
          </div>
          <div className="bg-surface px-6 py-4">
            <p className="font-heading text-lg font-semibold text-text-primary">
              {user?.name}
            </p>
            <Text variant="small">{user?.accountType}</Text>
          </div>
          <div className="flex items-center justify-between border-t border-text-secondary/10 px-6 py-3">
            <span className="inline-flex items-center gap-1.5 font-body text-xs">
              <span
                className="h-2 w-2 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span className="text-text-secondary">Status:</span>
              <span className="font-medium text-primary">Online</span>
            </span>
            <span className="font-body text-xs text-text-secondary">
              Member since:{" "}
              <span className="font-medium text-text-primary">
                {user?.memberSince}
              </span>
            </span>
          </div>

          <dl className="divide-y divide-text-secondary/10 border-t border-text-secondary/10">
            {infoRows.map((row) => (
              <div key={row.label} className="grid grid-cols-2 gap-4 px-6 py-3">
                <dt className="font-body text-sm text-text-secondary">
                  {row.label}
                </dt>
                <dd className="font-body text-sm text-text-primary">
                  {row.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-text-secondary/15 bg-surface">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${user?.name || "User"} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-1/2 w-1/2 text-text-secondary/40"
              aria-label="Default profile photo"
            >
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path
                fill="currentColor"
                d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4z"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
