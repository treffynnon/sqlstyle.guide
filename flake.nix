{
  description = "sqlstyle.guide";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (
      system: let
        overlays = [
        ];

        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # needed at compile time
        nativeBuildInputs = with pkgs; [];

        # needed at run time
        buildInputs = with pkgs; [
          ruby
        ];

        shellHook = ''
        '';
      in
        with pkgs; {
          devShells.default = mkShell {
            name = "sqlstyle.guide";
            inherit buildInputs nativeBuildInputs shellHook;
          };
        }
    );
}
