#!/bin/bash
# To remove blank space
if [ $# -eq 0 ];
then
 echo "Syntax: $(basename $0) file-name [command]"
 exit 1
fi
FILES=$1
CMD=$2
for i in $FILES
do
# remove all blanks and store them OUT
OUT=$(echo $i | sed 's/  *//g')
if [ "$CMD" == "" ];
then
#just show file
echo $OUT
else
#else execute command such as mv or cp or rm
[ "$i" != "$OUT" ] && $($CMD  "$i"  "$OUT")
fi
done

