#!/usr/bin/env bash
# Post-deploy smoke test — run this right after a production deploy.
# It hits the LIVE site and asserts the revenue-critical surfaces are correct,
# so a bad deploy is caught in ~15 seconds instead of days.
#
# Usage:  ./scripts/smoke.sh            (checks https://rotechllc.com)
#         BASE=https://preview-url ./scripts/smoke.sh
#
# Exit code 0 = all good. Non-zero = something is wrong; investigate or roll back
# (see DEPLOY.md → Rollback).

set -uo pipefail
BASE="${BASE:-https://rotechllc.com}"
fail=0

check_status() { # url expected_code label
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 20 "$1")
  if [ "$code" = "$2" ]; then echo "  ✅ $3 ($code)"; else echo "  ❌ $3 — expected $2, got $code"; fail=1; fi
}

check_contains() { # url needle label
  local body
  body=$(curl -s -L --max-time 20 "$1")
  if echo "$body" | grep -q -- "$2"; then echo "  ✅ $3"; else echo "  ❌ $3 — '$2' not found on $1"; fail=1; fi
}

echo "Smoke-testing $BASE"
echo "— pages return 200 —"
check_status "$BASE/"        200 "home"
check_status "$BASE/pricing" 200 "pricing"
check_status "$BASE/roster"  200 "roster (public)"

echo "— pricing shows the CORRECT current price (guards against the $96 revert) —"
check_contains "$BASE/pricing" "227" "pricing shows \$227"
if curl -s -L --max-time 20 "$BASE/pricing" | grep -q "For \$96 / 12 Months"; then
  echo "  ❌ pricing STILL shows the retired \$96 headline — prod reverted"; fail=1
else
  echo "  ✅ old \$96 headline is gone"
fi

echo "— core APIs respond —"
check_status "$BASE/api/founding-count" 200 "/api/founding-count"

echo
if [ "$fail" -eq 0 ]; then echo "✅ SMOKE PASSED — deploy looks healthy."; else echo "❌ SMOKE FAILED — see above. Consider rolling back (DEPLOY.md)."; fi
exit "$fail"
