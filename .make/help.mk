
# Help target
help:
	@echo "Available targets:"
	@echo "  rmdist         - Remove dist folder"
	@echo "  build          - Build the project"
	@echo "  build-prod     - Build for production (includes minification)"
	@echo "  dev            - Start development server"
	@echo "  run            - Run the application"
	@echo "  version-up 	- Update version"
	@echo "  pre            - Run pre-commit checks"
	@echo "  help           - Show this help message"

# Declare phony targets
.PHONY: all rmdist build build-prod dev run version-up pre help
