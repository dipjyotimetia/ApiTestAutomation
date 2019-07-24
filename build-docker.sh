project=api


if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi


  docker build  -t test/${project}:${version} .
