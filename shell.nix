{ pkgs ? import <nixpkgs> {} }:

let
  inherit (pkgs) mkShell;
in mkShell {
  name = "easy-budget-shell";
  buildInputs = with pkgs; [
		nodejs
    nodePackages.npm
  ];
}