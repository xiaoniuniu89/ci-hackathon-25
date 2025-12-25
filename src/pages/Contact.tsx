import React, { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
    if (formRef.current && window.Pageclip) {
      window.Pageclip.form(formRef.current, {
        onResponse: function(error: any, response: any) {
          if (error) {
            console.error('Form submission error:', error)
            setIsSubmitting(false)
          } else {
            console.log('Form submitted successfully:', response)
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
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    setErrors({})

    try {
      contactSchema.parse(formData)
      setIsSubmitting(true)
    } catch (error) {
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
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center py-5">
          <div className="w-full md:w-2/3 lg:w-7/12 px-0 mt-5">
            <h1 id="contact-heading">Contact Us</h1>
            <p className="text-lg text-muted-foreground">Have questions or suggestions? We'd love to hear from you!</p>
          </div>
          <Card className="w-full md:w-2/3 lg:w-7/12 mt-4 bg-muted">
            <CardContent className="p-4">
              <form
                ref={formRef}
                id="contactForm"
                action="https://send.pageclip.co/GAVsB8wSZedopsbpaTpWQHQeMcrmpG1E"
                className="pageclip-form"
                method="post"
                aria-labelledby="contact-heading"
                onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    aria-describedby="name-error"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2"
                  />
                  {errors.name && (
                    <span id="name-error" className="text-destructive text-sm" role="alert" aria-live="assertive">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    aria-describedby="email-error"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2"
                  />
                  {errors.email && (
                    <span id="email-error" className="text-destructive text-sm" role="alert" aria-live="assertive">
                      {errors.email}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">We'll never share your email with anyone else.</span>
                </div>
                <div className="mb-4">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="What is this about?"
                    aria-describedby="subject-error"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-2"
                  />
                  {errors.subject && (
                    <span id="subject-error" className="text-destructive text-sm" role="alert" aria-live="assertive">
                      {errors.subject}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    rows={7}
                    name="message"
                    id="message"
                    placeholder="Your message..."
                    aria-describedby="message-error"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2"
                  />
                  {errors.message && (
                    <span id="message-error" className="text-destructive text-sm" role="alert" aria-live="assertive">
                      {errors.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="mb-4 bg-secondary hover:bg-secondary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Contact
