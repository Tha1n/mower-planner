#!/bin/sh

case "$1" in
run)
    shift
    node $@ app.js
	;;
*)
    exec "$@"
	;;
esac

exit 0