import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StyleSystem } from "../StyleSystem";
import { STYLE_PRESETS } from "@/lib/models";

describe("StyleSystem", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load style presets correctly", () => {
    render(<StyleSystem onChange={mockOnChange} />);

    STYLE_PRESETS.forEach((preset) => {
      expect(screen.getByText(preset.name)).toBeInTheDocument();
    });
  });

  it("should update style parameters", async () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Adjust a style parameter
    const strengthSlider = screen.getByLabelText(/Style Strength/i);
    fireEvent.change(strengthSlider, { target: { value: "0.8" } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styleStrength: 0.8,
        }),
      );
    });
  });

  it("should handle style mixing", async () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Select multiple styles
    const style1 = STYLE_PRESETS[0].name;
    const style2 = STYLE_PRESETS[1].name;

    fireEvent.click(screen.getByText(style1));
    fireEvent.click(screen.getByText(style2));

    // Adjust mixing ratio
    const mixingSlider = screen.getByLabelText(/Mixing Ratio/i);
    fireEvent.change(mixingSlider, { target: { value: "0.6" } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: [style1, style2],
          mixingRatio: 0.6,
        }),
      );
    });
  });

  it("should validate style combinations", () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Try to select too many styles
    STYLE_PRESETS.forEach((preset) => {
      fireEvent.click(screen.getByText(preset.name));
    });

    expect(screen.getByText(/Maximum 2 styles/i)).toBeInTheDocument();
  });

  it("should handle style removal", async () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Select a style
    const style1 = STYLE_PRESETS[0].name;
    fireEvent.click(screen.getByText(style1));

    // Remove the style
    fireEvent.click(screen.getByText(style1));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: [],
        }),
      );
    });
  });

  it("should handle style reset", async () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Select a style
    const style1 = STYLE_PRESETS[0].name;
    fireEvent.click(screen.getByText(style1));

    // Reset styles
    const resetButton = screen.getByText(/Reset Styles/i);
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: [],
        }),
      );
    });
  });

  it("should handle style preview", async () => {
    render(<StyleSystem onChange={mockOnChange} />);

    // Select a style
    const style1 = STYLE_PRESETS[0].name;
    fireEvent.click(screen.getByText(style1));

    // Preview style
    const previewButton = screen.getByText(/Preview Style/i);
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByText(/Previewing/i)).toBeInTheDocument();
    });
  });
});
