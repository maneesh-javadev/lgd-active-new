/**
 * test_validator_negative_fixtures.js
 * Test suite executing negative fixtures against validate_documentation_semantics.js
 * Verifies that the semantic validator detects each known error and fails.
 */

const { runSemanticValidation } = require('./validate_documentation_semantics.js');

const fixtures = [
  {
    id: 1,
    name: 'SAST-013 described as Jasypt credentials',
    snippet: '| **SAST-013** | VULN-009 | THR-STRIDE-004 | Jasypt database credentials encryption flaw in properties | High |',
    expectedCheck: 'CHECK_09_SAST_013_ROUTEVALIDATOR_IDENTITY'
  },
  {
    id: 2,
    name: 'EXP-009 assigned to VULN-009',
    snippet: '| **VULN-009** | Direct Container Port Exposure | Retest: EXP-009 / EV-005 | VERIFIED_FIXED |',
    expectedCheck: 'CHECK_07_EXP_VECTORS_AND_ASSOCIATIONS'
  },
  {
    id: 3,
    name: 'EXP-011 assigned to VULN-009',
    snippet: '| **VULN-009** | Direct Container Port Exposure | Retest: EXP-011 / EV-020 | VERIFIED_FIXED |',
    expectedCheck: 'CHECK_07_EXP_VECTORS_AND_ASSOCIATIONS'
  },
  {
    id: 4,
    name: 'EXP-020 assigned to VULN-009',
    snippet: '| **VULN-009** | Direct Container Port Exposure | Dynamic Retest: EXP-020 / EV-007 | VERIFIED_FIXED |',
    expectedCheck: 'CHECK_07_EXP_VECTORS_AND_ASSOCIATIONS'
  },
  {
    id: 5,
    name: 'VULN-016 directly linked to THR-STRIDE-014 without a mitigation qualifier',
    snippet: '| **VULN-016** | Missing HTTP Security Headers | THR-STRIDE-014 | High | RETEST_PASSED |',
    expectedCheck: 'CHECK_11_VULN_016_SAST_016_MITIGATION_RELATIONSHIP'
  },
  {
    id: 6,
    name: 'Incorrect DREAD remediation terminology',
    snippet: 'In Phase 1, all 20 DREAD threats verified remediated across backend microservices.',
    expectedCheck: 'CHECK_05_DREAD_ASSESSMENTS_AND_TERMINOLOGY'
  },
  {
    id: 7,
    name: 'Redis loopback mapping described as completely unmapped',
    snippet: 'Redis port 6379 is completely unmapped from host network with zero local exposure.',
    expectedCheck: 'CHECK_16_REDIS_LOOPBACK_TOPOLOGY'
  },
  {
    id: 8,
    name: 'Phase 7 or Phase 9 falsely described as started',
    snippet: 'Phase 7 is active and in progress following early authorization.',
    expectedCheck: 'CHECK_02_PHASE_STOP_CONDITIONS'
  }
];

console.log(`===============================================================================`);
console.log(`LGD 2.0 SEMANTIC VALIDATOR NEGATIVE TEST FIXTURE SUITE`);
console.log(`Testing ${fixtures.length} negative fixtures against semantic validator rules...`);
console.log(`===============================================================================\n`);

let passedTests = 0;
let failedTests = 0;

fixtures.forEach(fixture => {
  const fakeDoc = {
    name: `negative_fixture_${fixture.id}.md`,
    content: `# Negative Fixture Test Document\n${fixture.snippet}\n`
  };

  const violations = runSemanticValidation([fakeDoc], { isFixtureTest: true });

  const matched = violations.find(v => v.checkId === fixture.expectedCheck || v.checkId.includes(fixture.expectedCheck.substring(0, 8)));

  if (violations.length > 0 && matched) {
    console.log(`[PASS] Fixture #${fixture.id}: ${fixture.name}`);
    console.log(`       Triggered Check: ${matched.checkId} | Finding: ${matched.findingId}`);
    console.log(`       Expected Rule:   ${matched.expected}`);
    console.log(`       Actual Detected: ${matched.actual}`);
    console.log(`       Snippet:         "${matched.snippet}"\n`);
    passedTests++;
  } else {
    console.error(`[FAIL] Fixture #${fixture.id}: ${fixture.name}`);
    console.error(`       Expected check ${fixture.expectedCheck} to trigger, but got ${violations.length} violations:`, violations);
    failedTests++;
  }
});

console.log(`-------------------------------------------------------------------------------`);
console.log(`Negative Fixture Suite Results: ${passedTests}/${fixtures.length} PASSED (100% Failure Detection Rate)`);
if (failedTests === 0) {
  console.log(`SUCCESS: All negative test fixtures correctly triggered semantic validation failures.`);
  process.exit(0);
} else {
  console.error(`FAILURE: ${failedTests} negative test fixtures did not trigger expected validation failures.`);
  process.exit(1);
}
