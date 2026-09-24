"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

type Row = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  isBlocked?: boolean;
  isVerified: boolean;
  orders: number;
  spent: number;
  createdAt: string;
};

type Detail = {
  user: Row & { blockedReason?: string };
  orders: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    orderStatus: string;
  }[];
  addresses: {
    _id: string;
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  }[];
};

type Target = { id: string; name: string; isBlocked?: boolean };

export default function UsersPage() {
  const [users, setUsers] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Detail | null>(null);

  const [target, setTarget] = useState<Target | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (status) q.set("status", status);

      const res = await fetch(`/api/admin/users?${q.toString()}`);
      if (!res.ok) throw new Error("Users load cheyyan pattiyilla");
      setUsers((await res.json()).users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 350); // search debounce
    return () => clearTimeout(t);
  }, [load]);

  async function openDetails(id: string) {
    const res = await fetch(`/api/admin/users/${id}`);
    if (res.ok) setSelected(await res.json());
    else toast.error("User details load cheyyan pattiyilla");
  }

  function askToggle(id: string, name: string, isBlocked?: boolean) {
    setReason("");
    setTarget({ id, name, isBlocked });
  }

  async function confirmToggle() {
    if (!target) return;
    const blocking = !target.isBlocked;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/users/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBlocked: blocking,
          reason: blocking ? reason : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(
        blocking ? `${target.name} blocked` : `${target.name} unblocked`,
      );
      setTarget(null);
      load();
      if (selected?.user._id === target.id) openDetails(target.id); // drawer refresh
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-black/50">
          Registered customers-inte details manage cheyyuka
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone"
          className="w-72 rounded-lg border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-black/5 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Spent</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-black/50">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-black/50">
                  No users found
                </td>
              </tr>
            )}
            {users.map((u) => {
              const fullName = `${u.firstName} ${u.lastName}`;
              return (
                <tr key={u._id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={u.avatar}
                        alt={fullName}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{fullName}</p>
                        <p className="text-xs text-black/50">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone || "-"}</td>
                  <td className="p-3">{u.orders}</td>
                  <td className="p-3">₹{u.spent.toLocaleString("en-IN")}</td>
                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        u.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="space-x-3 p-3 text-right">
                    <button
                      onClick={() => openDetails(u._id)}
                      className="underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => askToggle(u._id, fullName, u.isBlocked)}
                      className={
                        u.isBlocked ? "text-green-700" : "text-red-600"
                      }
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Details drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="h-full w-full max-w-md space-y-4 overflow-y-auto bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={selected.user.avatar}
                  alt={`${selected.user.firstName} ${selected.user.lastName}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {selected.user.firstName} {selected.user.lastName}
                  </h2>
                  <p className="text-sm text-black/50">
                    @{selected.user.username}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl">
                ×
              </button>
            </div>

            <div className="space-y-1 text-sm">
              <p>Email: {selected.user.email}</p>
              <p>Phone: {selected.user.phone || "-"}</p>
              <p>Verified: {selected.user.isVerified ? "Yes" : "No"}</p>
              <p>
                Joined:{" "}
                {new Date(selected.user.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            {selected.user.isBlocked && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Blocked. Reason:{" "}
                {selected.user.blockedReason || "No reason given"}
              </div>
            )}

            <button
              onClick={() =>
                askToggle(
                  selected.user._id,
                  `${selected.user.firstName} ${selected.user.lastName}`,
                  selected.user.isBlocked,
                )
              }
              className={`w-full rounded-lg py-2 text-sm text-white ${
                selected.user.isBlocked ? "bg-green-700" : "bg-red-600"
              }`}
            >
              {selected.user.isBlocked ? "Unblock user" : "Block user"}
            </button>

            <div>
              <h3 className="mb-2 font-medium">Recent orders</h3>
              {selected.orders.length === 0 && (
                <p className="text-sm text-black/50">No orders yet</p>
              )}
              {selected.orders.map((o) => (
                <div
                  key={o._id}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span>{o.orderNumber}</span>
                  <span>{o.orderStatus}</span>
                  <span>₹{o.totalAmount}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-2 font-medium">Addresses</h3>
              {selected.addresses.length === 0 && (
                <p className="text-sm text-black/50">No saved addresses</p>
              )}
              {selected.addresses.map((a) => (
                <p key={a._id} className="border-b py-2 text-sm">
                  {a.fullName}, {a.addressLine1}, {a.city}, {a.state} -{" "}
                  {a.pincode}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block / Unblock confirm modal */}
      {target && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !submitting && setTarget(null)}
        >
          <div
            className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">
              {target.isBlocked ? "Unblock user?" : "Block user?"}
            </h3>
            <p className="text-sm text-black/60">
              {target.isBlocked
                ? `${target.name}-ne veendum login cheyyan anuvadikkum.`
                : `${target.name}-ne block cheythaal login cheyyan pattilla.`}
            </p>

            {!target.isBlocked && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Reason (optional)"
                className="w-full rounded-lg border p-2 text-sm"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTarget(null)}
                disabled={submitting}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                disabled={submitting}
                className={`rounded-lg px-4 py-2 text-sm text-white disabled:opacity-60 ${
                  target.isBlocked ? "bg-green-700" : "bg-red-600"
                }`}
              >
                {submitting
                  ? "Please wait..."
                  : target.isBlocked
                    ? "Unblock"
                    : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
