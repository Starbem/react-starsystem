import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders label text', () => {
    render(
      <FormField label="Email">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders helperText when provided', () => {
    render(
      <FormField helperText="We will never share your email">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByText('We will never share your email')).toBeInTheDocument()
  })

  it('renders errorMessage when provided', () => {
    render(
      <FormField errorMessage="Email is required">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('errorMessage overrides helperText', () => {
    render(
      <FormField helperText="Helper text" errorMessage="Error text">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })

  it('renders a visual required asterisk when required', () => {
    render(
      <FormField label="Email" required>
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('sets aria-required on the child field when required', () => {
    render(
      <FormField label="Email" required>
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true')
  })

  it('does not set aria-required when not required', () => {
    render(
      <FormField label="Email">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-required')
  })

  it('associates label to the child field via htmlFor/id', () => {
    render(
      <FormField label="Email" htmlFor="email-field">
        <input type="text" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const label = screen.getByText('Email')
    expect(input).toHaveAttribute('id', 'email-field')
    expect(label.closest('label')).toHaveAttribute('for', 'email-field')
  })

  it('generates an id automatically when htmlFor is not provided', () => {
    render(
      <FormField label="Email">
        <input type="text" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('id')).toBeTruthy()
  })

  it('links aria-describedby to the message when a message is present', () => {
    render(
      <FormField htmlFor="email-field" helperText="Helper text">
        <input type="text" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const message = screen.getByText('Helper text')
    expect(input).toHaveAttribute('aria-describedby', 'email-field-message')
    expect(message).toHaveAttribute('id', 'email-field-message')
  })

  it('does not set aria-describedby when no message is present', () => {
    render(
      <FormField label="Email">
        <input type="text" />
      </FormField>,
    )
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <FormField label="Email" helperText="We will never share your email" required>
        <input type="text" />
      </FormField>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
