export src_path=dist
export dst_path=/usr/share/nginx/flock

mkdir -p $dst_path
cp -r $src_path/* $dst_path