#!/bin/bash

find 'static\musics' -name '*.jpg' -exec convert {} -blur 0x100 {}.blur \;