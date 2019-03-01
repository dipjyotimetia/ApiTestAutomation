#!/bin/bash

case $1 in
  "run")
    npm test
    ;;
  *)
    echo "usage: $0 [run]"
    exit 1
    ;;
esac