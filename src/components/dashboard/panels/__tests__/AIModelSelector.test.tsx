import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIModelSelector from "../AIModelSelector";
import { AI_MODELS, STYLE_PRESETS } from "@/lib/models";

describe("AIModelSelector", () => {
  const mockOnGenerate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate model parameters", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Test prompt length validation
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "ab" } }); // Too short

    const generateButton = screen.getByText(/Generate/i);
    expect(generateButton).toBeDisabled();

    // Test valid prompt
    fireEvent.change(promptInput, { target: { value: "A valid prompt" } });
    expect(generateButton).not.toBeDisabled();
  });

  it("should handle style preset combinations", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Select a style preset
    const styleSelect = screen.getByLabelText(/Style Preset/i);
    fireEvent.change(styleSelect, { target: { value: STYLE_PRESETS[0].id } });

    // Verify prompt gets updated with style preset
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    expect(promptInput).toHaveValue(
      expect.stringContaining(STYLE_PRESETS[0].prompt),
    );
  });

  it("should handle batch processing queue", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Set batch size
    const batchSizeSlider = screen.getByLabelText(/Batch Size/i);
    fireEvent.change(batchSizeSlider, { target: { value: "3" } });

    // Fill required fields
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "Test prompt" } });

    // Generate
    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          batchSize: 3,
          prompt: "Test prompt",
        }),
      );
    });
  });

  it("should track generation progress", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Mock a generation process
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "Test prompt" } });

    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);

    // Verify progress elements are shown
    await waitFor(() => {
      expect(screen.getByText(/Generating/i)).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  it("should handle negative prompt input", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Fill required fields
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "Test prompt" } });

    const negativePromptInput = screen.getByPlaceholder("Enter negative prompt here...");
    fireEvent.change(negativePromptInput, { target: { value: "Test negative prompt" } });

    // Generate
    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: "Test prompt",
          negativePrompt: "Test negative prompt",
        }),
      );
    });
  });

  it("should handle guidance scale input", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Fill required fields
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "Test prompt" } });

    const guidanceScaleSlider = screen.getByLabelText(/Guidance Scale/i);
    fireEvent.change(guidanceScaleSlider, { target: { value: "10" } });

    // Generate
    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: "Test prompt",
          guidance: 10,
        }),
      );
    });
  });

  it("should handle seed input", async () => {
    render(<AIModelSelector onGenerate={mockOnGenerate} />);

    // Fill required fields
    const promptInput = screen.getByPlaceholder("Enter your prompt here...");
    fireEvent.change(promptInput, { target: { value: "Test prompt" } });

    const seedInput = screen.getByLabelText(/Seed/i);
    fireEvent.change(seedInput, { target: { value: "123456" } });

    // Generate
    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: "Test prompt",
          seed: 123456,
        }),
      );
    });
  });
});
