import { render, screen } from "@testing-library/react";
import { Skeleton, SkeletonPage, SkeletonText } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive technology and keeps its size classes", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);
    const block = container.firstElementChild;

    expect(block).toHaveAttribute("aria-hidden", "true");
    expect(block).toHaveClass("skeleton", "h-4", "w-20");
  });
});

describe("SkeletonText", () => {
  it("renders the requested number of lines with a shorter last line", () => {
    const { container } = render(<SkeletonText lines={4} />);
    const lines = container.querySelectorAll(".skeleton");

    expect(lines).toHaveLength(4);
    expect(lines[3]).toHaveClass("w-2/3");
    expect(lines[0]).not.toHaveClass("w-2/3");
  });

  it("keeps a single line full width", () => {
    const { container } = render(<SkeletonText lines={1} />);

    expect(container.querySelector(".skeleton")).not.toHaveClass("w-2/3");
  });
});

describe("SkeletonPage", () => {
  it("announces loading once, as a busy status region", () => {
    render(
      <SkeletonPage label="Loading the album">
        <Skeleton />
        <Skeleton />
      </SkeletonPage>,
    );
    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveTextContent("Loading the album");
  });
});
