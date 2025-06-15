import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import PriorityBadge from "../../components/common/PriorityBadge"

describe("PriorityBadge", () => {
  it("renders high priority badge correctly", () => {
    render(<PriorityBadge priority="high" />)
    expect(screen.getByText("High Priority")).toBeInTheDocument()
    expect(screen.getByLabelText("Priority level: high")).toBeInTheDocument()
  })

  it("renders medium priority badge correctly", () => {
    render(<PriorityBadge priority="medium" />)
    expect(screen.getByText("Medium Priority")).toBeInTheDocument()
    expect(screen.getByLabelText("Priority level: medium")).toBeInTheDocument()
  })

  it("renders low priority badge correctly", () => {
    render(<PriorityBadge priority="low" />)
    expect(screen.getByText("Low Priority")).toBeInTheDocument()
    expect(screen.getByLabelText("Priority level: low")).toBeInTheDocument()
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<PriorityBadge priority="high" size="small" />)
    expect(screen.getByText("High Priority")).toBeInTheDocument()

    rerender(<PriorityBadge priority="high" size="medium" />)
    expect(screen.getByText("High Priority")).toBeInTheDocument()
  })
})
