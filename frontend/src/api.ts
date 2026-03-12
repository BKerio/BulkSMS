const BACKEND = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000'


async function handleResponse(res: Response) {
const data = await res.json().catch(() => ({}))
if (!res.ok) throw data
return data
}


export async function requestOtp(phone: string) {
const res = await fetch(`${BACKEND}/api/auth/send-otp`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ phone }),
})
return handleResponse(res)
}


export async function verifyOtp(phone: string, otp: string) {
const res = await fetch(`${BACKEND}/api/auth/verify-otp`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ phone, otp }),
})
return handleResponse(res)
}


export async function fetchDashboard(token: string) {
const res = await fetch(`${BACKEND}/api/dashboard`, {
headers: { Authorization: `Bearer ${token}` },
})
return handleResponse(res)
}