{ pkgs, ... }:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [ 
		nodejs
    nodePackages.npm 
	];
}
