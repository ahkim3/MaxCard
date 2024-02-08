#!/bin/bash

cd /var/MaxCard/

source venv/bin/activate

echo "--Installing Requirements--"
python3 -m pip install -r requirements.txt

echo "--starting server--"
nohup python3 ./app.py > output.log 2>&1 &

sleep 10
echo "--server running server--"
exit 0