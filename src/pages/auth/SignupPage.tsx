import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "@/context/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"

interface Class {
  id: string
  name: string
}

interface Batch {
  id: string
  name: string
  classId: string
}

export function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [classId, setClassId] = useState<string | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const [classesRes, batchesRes] = await Promise.all([
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/batches`),
      ])
      const classesData = await classesRes.json()
      const batchesData = await batchesRes.json()
      setClasses(classesData)
      setBatches(batchesData)
    }
    fetchData()
  }, [])

  const filteredBatches = batches.filter((b) => b.classId === classId)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!classId) {
      setError("Please select a class")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signup({
        email,
        password,
        name,
        role: "student",
        classId,
        batchId,
      })
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Student Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={classId || ""}
                onValueChange={(value) => {
                  if (value !== null) {
                    setClassId(value)
                    setBatchId(null)
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batch (Optional)</Label>
              <Select
                value={batchId || ""}
                onValueChange={(value) => {
                  if (value !== null) setBatchId(value)
                }}
                disabled={!classId || filteredBatches.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
