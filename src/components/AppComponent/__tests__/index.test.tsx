import React from "react";
import { render, screen } from "@testing-library/react";
import * as gameService from "../../../services/gameService";
import AppComponent from "..";
import { act } from "react-dom/test-utils";

test("renders a button", () => {
    render(<AppComponent />);
    const button = screen.getByText(/new game/i);
    expect(button).toBeInTheDocument();
});

test("creates a new game", () => {
    render(<AppComponent />);
    jest.spyOn(gameService, 'initGame');
    const initGame = gameService.initGame as jest.MockedFunction<typeof gameService.initGame>;
    initGame.mockClear();
    const button = screen.getByTestId("newgame");
    act(() => {
        button.click();
    });
    expect(initGame).toHaveBeenCalled();
});