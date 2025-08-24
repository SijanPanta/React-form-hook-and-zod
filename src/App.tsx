import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const schema = z.object({
  firstName: z.string().min(1, "First Name is required").refine(val => val.trim() !== "", {
    message: "First Name cannot be empty spaces",
  }),
  lastName: z.string().min(1, "Last Name is required").refine(val => val.trim() !== "", {
    message: "Last Name cannot be empty spaces",
  }),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  contact: z.string()
    .min(1, "Contact number is required")
    .regex(/^[0-9]{10}$/, "Contact must be 10 digits"),
  role: z.string().min(1, "Role is required"),
  skills: z.array(
    z.object({
      value: z.string().min(1, "Skill is required").refine(val => val.trim() !== "", {
        message: "Skill cannot be empty spaces",
      }),
    })
  ).min(1, "At least one skill is required"),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function App() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: [{ value: "" }], // at least one field by default
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills"
  })

  const onSubmit = (data: FormData) => {
    setSubmittedData(data)
    reset()
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">User Registration Form</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* First Name */}
        <div>
          <input
            placeholder="First Name"
            {...register("firstName")}
            className="w-full border p-2 rounded"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <input
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full border p-2 rounded"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Contact */}
        <div>
          <input
            type="text"
            placeholder="Contact Number"
            {...register("contact")}
            className="w-full border p-2 rounded"
          />
          {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
        </div>

        {/* Role */}
        <div>
          <select {...register("role")} className="w-full border p-2 rounded">
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Skills - Dynamic Fields */}
        <div>
          <label className="font-medium">Skills</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mt-2">
              <input
                placeholder={`Skill ${index + 1}`}
                {...register(`skills.${index}.value` as const)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
                disabled={fields.length === 1}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add Skill
          </button>
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
        </div>

        {/* Message */}
        <div>
          <textarea
            placeholder="Message (optional)"
            {...register("message")}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>

      {/* Success Message */}
      {submittedData && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h3 className="font-bold text-green-700">✅ Form submitted successfully!</h3>
          <pre className="text-sm mt-2 bg-gray-100 p-2 rounded">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
