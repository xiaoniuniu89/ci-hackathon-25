import React, { useState, useEffect, useRef } from 'react'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactFormData = z.infer<typeof contactSchema>

declare global {
  interface Window {
    Pageclip?: {
      form: (form: HTMLFormElement, options?: any) => void
    }
  }
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Initialize Pageclip when component mounts
    if (formRef.current && window.Pageclip) {
      window.Pageclip.form(formRef.current, {
        onResponse: function(error: any, response: any) {
          if (error) {
            console.error('Form submission error:', error)
            setIsSubmitting(false)
          } else {
            console.log('Form submitted successfully:', response)
            // Reset form on success
            setFormData({ name: '', email: '', subject: '', message: '' })
            setIsSubmitting(false)
            alert('Message sent successfully!')
          }
        }
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    // Clear previous errors
    setErrors({})

    try {
      contactSchema.parse(formData)
      // Validation passed - allow form to proceed to Pageclip
      setIsSubmitting(true)
    } catch (error) {
      // Validation failed - prevent submission and show errors
      e.preventDefault()
      e.stopPropagation()

      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach(issue => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <main id="main-contact">
      <div className="container">
        <div className="row d-flex justify-content-center py-5">
          <div className="col-12 col-md-8 col-lg-7 px-0 mt-5">
            <h1 id="contact-heading">Contact Us</h1>
            <p className="lead">Have questions or suggestions? We'd love to hear from you!</p>
          </div>
          <div className="card col-12 col-md-8 col-lg-7 mt-4 px-0 bg-light">
            <form
              ref={formRef}
              id="contactForm"
              action="https://send.pageclip.co/GAVsB8wSZedopsbpaTpWQHQeMcrmpG1E"
              className="pageclip-form p-4"
              method="post"
              aria-labelledby="contact-heading"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter your name"
                  aria-describedby="name-error"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <span id="name-error" className="text-danger small" role="alert" aria-live="assertive">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email">Email Address</label>
                <input
                  className="form-control mt-2"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span id="email-error" className="text-danger small" role="alert" aria-live="assertive">
                    {errors.email}
                  </span>
                )}
                <span className="form-text">We'll never share your email with anyone else.</span>
              </div>
              <div className="mb-4">
                <label htmlFor="subject">Subject</label>
                <input
                  className="form-control mt-2"
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="What is this about?"
                  aria-describedby="subject-error"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && (
                  <span id="subject-error" className="text-danger small" role="alert" aria-live="assertive">
                    {errors.subject}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control mt-2"
                  rows={7}
                  name="message"
                  id="message"
                  placeholder="Your message..."
                  aria-describedby="message-error"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                {errors.message && (
                  <span id="message-error" className="text-danger small" role="alert" aria-live="assertive">
                    {errors.message}
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-success pageclip-form__submit mb-4" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact
