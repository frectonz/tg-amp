{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      forAllSystems =
        fn:
        let
          systems = [
            "x86_64-linux"
            "aarch64-linux"
            "aarch64-darwin"
          ];
          overlays = [];
        in
        nixpkgs.lib.genAttrs systems (
          system:
          fn (
            import nixpkgs {
              inherit system overlays;
            }
          )
        );
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          buildInputs = [ pkgs.pnpm pkgs.nodejs ];
        };
      });

      formatter = forAllSystems (
        pkgs:
        pkgs.treefmt.withConfig {
          runtimeInputs = [ pkgs.nixfmt ];
          settings = {
            on-unmatched = "info";
            formatter.nixfmt = {
              command = "nixfmt";
              includes = [ "*.nix" ];
            };
          };
        }
      );
    };
}
