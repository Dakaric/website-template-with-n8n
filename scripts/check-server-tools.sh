#!/usr/bin/env bash

set -euo pipefail

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

log() {
  printf "\n[setup-prod] %s\n" "$*"
}

need_root() {
  if [ "${EUID:-$(id -u)}" -ne 0 ]; then
    if command_exists sudo; then
      echo "sudo"
    else
      echo ""
    fi
  else
    echo ""
  fi
}

ensure_package_manager() {
  if command_exists apt-get; then
    echo "apt"
  elif command_exists yum; then
    echo "yum"
  else
    echo ""
  fi
}

install_packages() {
  local manager="$1"
  shift
  local packages=("$@")
  local sudo_cmd
  sudo_cmd=$(need_root)

  case "$manager" in
    apt)
      log "Installiere Pakete via apt-get: ${packages[*]}"
      $sudo_cmd apt-get update -y >/dev/null
      $sudo_cmd apt-get install -y "${packages[@]}"
      ;;
    yum)
      log "Installiere Pakete via yum: ${packages[*]}"
      $sudo_cmd yum install -y "${packages[@]}"
      ;;
    *)
      log "Kein unterstützter Paketmanager gefunden – bitte installiere ${packages[*]} manuell."
      return 1
      ;;
  esac
}

ensure_docker() {
  if command_exists docker; then
    log "Docker ist bereits installiert."
    return 0
  fi

  log "Docker nicht gefunden – versuche Installation."
  local sudo_cmd
  sudo_cmd=$(need_root)

  if command_exists curl; then
    curl -fsSL https://get.docker.com | $sudo_cmd sh
  else
    local manager
    manager=$(ensure_package_manager)
    install_packages "$manager" curl || true
    curl -fsSL https://get.docker.com | $sudo_cmd sh
  fi

  if command_exists systemctl; then
    $sudo_cmd systemctl enable docker >/dev/null 2>&1 || true
    $sudo_cmd systemctl start docker >/dev/null 2>&1 || true
  fi

  log "Docker Installation abgeschlossen."
}

ensure_docker_compose() {
  if docker compose version >/dev/null 2>&1; then
    log "Docker Compose Plugin ist bereits installiert."
    return 0
  fi

  log "Docker Compose Plugin nicht gefunden – versuche Installation."
  local manager
  manager=$(ensure_package_manager)
  if [ "$manager" = "apt" ]; then
    install_packages apt docker-compose-plugin
  elif [ "$manager" = "yum" ]; then
    install_packages yum docker-compose-plugin || true
  else
    log "Bitte installiere das docker compose Plugin manuell."
  fi
}

ensure_git_and_curl() {
  local manager
  manager=$(ensure_package_manager)
  local missing=()

  command_exists git || missing+=("git")
  command_exists curl || missing+=("curl")

  if [ ${#missing[@]} -gt 0 ]; then
    install_packages "$manager" "${missing[@]}" || true
  else
    log "git und curl sind bereits installiert."
  fi
}

log "Prüfe Server-Voraussetzungen (Docker, Docker Compose, git, curl)."
ensure_git_and_curl
ensure_docker
ensure_docker_compose
log "Server-Check abgeschlossen."

