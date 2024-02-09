#!/bin/bash

cd /var/MaxCard/

source venv/bin/activate

echo "--Installing Requirements--"
python3 -m pip install -r requirements.txt

echo "--starting server--"
script /dev/null
screen -d -m -S maxcardserver python3 ./app.py
echo "--server running--"

exit 0