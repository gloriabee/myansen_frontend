import { render, screen } from "@testing-library/react";
import HomePage from "@/pages/home/homepage";

// Mock Navigate 
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Homepage", () => {
  test("renders homepage with tabs", () => {
    render(<HomePage />);
    // Check if the tabs are rendered
    const tabs = screen.getByRole("tablist");
    expect(tabs).toBeInTheDocument();
  });
 
});
