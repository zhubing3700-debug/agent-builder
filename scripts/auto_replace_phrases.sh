#!/usr/bin/env bash
set -euo pipefail

echo “开始替换短语：房贷提前还贷 -> 解绑基金定投，取消定投/定投取消 -> 停止自动理财申购”

search_and_replace() {
  pattern=”$1”
  perl_expr=”$2”
  mapfile -t files < <(grep -IlR --exclude-dir={images,node_modules,.git} -E “$pattern” . || true)
  if [ “${#files[@]}” -gt 0 ]; then
    for f in “${files[@]}”; do
      perl -CSD -pi -e “$perl_expr” “$f”
      echo “修改: $f”
    done
  else
    echo “未找到匹配: $pattern”
  fi
}

# 将”房贷提前还贷”或”提前还贷”替换为”解绑基金定投”
search_and_replace '房贷提前还贷|提前还贷' 's/房贷提前还贷/解绑基金定投/g; s/提前还贷/解绑基金定投/g'

# 将”取消定投”或”定投取消”替换为”停止自动理财申购”
search_and_replace '取消定投|定投取消' 's/取消定投/停止自动理财申购/g; s/定投取消/停止自动理财申购/g'

echo “替换完成。请手动 review 变更并提交。”
