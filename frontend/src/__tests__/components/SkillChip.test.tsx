import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import SkillChip from "../../components/common/SkillChip"
import { jest } from "@jest/globals"

describe("SkillChip", () => {
  it("renders skill chip correctly", () => {
    render(<SkillChip skill="JavaScript" />)
    expect(screen.getByText("JavaScript")).toBeInTheDocument()
    expect(screen.getByLabelText("Skill: JavaScript")).toBeInTheDocument()
  })

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn()
    render(<SkillChip skill="React" onDelete={mockOnDelete} />)

    const deleteButton = screen.getByTestId("CancelIcon")
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  it("renders without delete button when onDelete is not provided", () => {
    render(<SkillChip skill="TypeScript" />)
    expect(screen.queryByTestId("CancelIcon")).not.toBeInTheDocument()
  })

  it("renders with different variants", () => {
    const { rerender } = render(<SkillChip skill="Node.js" variant="filled" />)
    expect(screen.getByText("Node.js")).toBeInTheDocument()

    rerender(<SkillChip skill="Node.js" variant="outlined" />)
    expect(screen.getByText("Node.js")).toBeInTheDocument()
  })
})
