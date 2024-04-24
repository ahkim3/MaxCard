# Running Instructions

You must be using python.

Install the python dependencies:

```console
pip install -r carrdloader/requirements.txt
```
or
```console
python3 -m pip install -r carrdloader/requirements.txt
```
install the aws cli

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

configure the cli
```console
aws configure
```
Using the credentials from the discord

AWS Access Key ID: *See Discord*
AWS Secret Access Key: *See Discord*
Default region name: us-east-1:
Default output format: None

run the program

```console
python3 carrdloader/loadcard.py
```