# CSV Quick Check

CSV Quick Check is a small, local checker for product catalog CSVs. From this package directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a modern browser, paste a non-sensitive CSV, and select "Check CSV." The CSV stays in your browser. The checker does not send it to a server or save it in browser storage. For immediate use without running a local server, use the [verified hosted tool](https://bryan-joseph-storefront-repairs.brian343508.chatgpt.site/catalog-review/).

`examples/catalog.csv` is fictional and demonstrates blank cells, an exact duplicate row, a repeated SKU, and outer whitespace.

The checker supports up to 300 product rows, 100 columns, and 200,000 characters. It checks CSV structure, exact duplicate rows, blank cells, outer whitespace, repeated SKU, Variant SKU, ASIN, or ID values, and common spreadsheet formula markers. It does not verify prices or links, or certify an import. Zero findings means only that these checks found nothing.

To ask Bryan Joseph RowPatch Studio about a proposed $79 review of one small product catalog CSV, use the [paid quote issue template](https://github.com/bj97301/csv-quick-check/issues/new?template=paid-quote-inquiry.yml). Describe scope with a synthetic or non-sensitive example only. Do not post real CSVs, customer data, credentials, payment details, private addresses, or confidential information. A scope agreement is required before work starts. An AI agent handles the work. Human review is not included. Opening an issue does not accept work or collect payment.
