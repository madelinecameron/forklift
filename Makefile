install:
	@chmod +x forklift
	@cp forklift ~/bin
	@mkdir -p ~/.config/forklift
	@cp templates/* ~/.config/forklift
	@cp forklift.json ~/.config/forklift
