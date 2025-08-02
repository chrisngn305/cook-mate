#!/bin/bash

# Cook Mate Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start production environment
start_production() {
    print_status "Starting production environment..."
    docker-compose up -d
    print_success "Production environment started successfully!"
    print_status "Services available at:"
    echo "  - Backend API: http://localhost:3000"
    echo "  - Frontend: http://localhost:3001"
    echo "  - Database: localhost:3306"
}

# Function to start development environment
start_development() {
    print_status "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started successfully!"
    print_status "Services available at:"
    echo "  - Backend API: http://localhost:3000 (with hot reload)"
    echo "  - Database: localhost:3306"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_success "All services stopped successfully!"
}

# Function to view logs
view_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Viewing all logs..."
        docker-compose logs -f
    else
        print_status "Viewing logs for $service..."
        docker-compose logs -f "$service"
    fi
}

# Function to view development logs
view_dev_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Viewing all development logs..."
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_status "Viewing development logs for $service..."
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

# Function to rebuild containers
rebuild() {
    local env=${1:-"production"}
    if [ "$env" = "dev" ]; then
        print_status "Rebuilding development containers..."
        docker-compose -f docker-compose.dev.yml build --no-cache
        print_success "Development containers rebuilt successfully!"
    else
        print_status "Rebuilding production containers..."
        docker-compose build --no-cache
        print_success "Production containers rebuilt successfully!"
    fi
}

# Function to reset everything
reset() {
    print_warning "This will remove all containers, networks, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Stopping and removing all containers..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        
        print_status "Removing all images..."
        docker rmi $(docker images -q cook-mate* 2>/dev/null) 2>/dev/null || true
        
        print_status "Removing unused containers, networks, and images..."
        docker system prune -f
        
        print_success "Reset completed successfully!"
    else
        print_status "Reset cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "Container Status:"
    echo ""
    docker-compose ps
    echo ""
    docker-compose -f docker-compose.dev.yml ps
}

# Function to show help
show_help() {
    echo "Cook Mate Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start-prod     Start production environment"
    echo "  start-dev      Start development environment"
    echo "  stop           Stop all services"
    echo "  logs [SERVICE] View production logs"
    echo "  logs-dev [SERVICE] View development logs"
    echo "  rebuild [env]  Rebuild containers (production|dev)"
    echo "  reset          Reset everything (containers, networks, volumes)"
    echo "  status         Show container status"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-prod"
    echo "  $0 start-dev"
    echo "  $0 logs backend"
    echo "  $0 logs-dev backend"
    echo "  $0 rebuild dev"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "start-prod")
            start_production
            ;;
        "start-dev")
            start_development
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            view_logs "$2"
            ;;
        "logs-dev")
            view_dev_logs "$2"
            ;;
        "rebuild")
            rebuild "$2"
            ;;
        "reset")
            reset
            ;;
        "status")
            show_status
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@" 