-- ZAFLA Sovereign Intelligence Platform v4 — Database Schema
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS intelligence;
CREATE SCHEMA IF NOT EXISTS legal;
CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bica_protocol VARCHAR(32) NOT NULL UNIQUE,
    bica_nonce VARCHAR(64) NOT NULL,
    public_key TEXT NOT NULL,
    role VARCHAR(32) DEFAULT 'operative',
    created_at TIMESTAMPTZ DEFAULT now(),
    last_attestation TIMESTAMPTZ
);

CREATE TABLE audit.attestation_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_type VARCHAR(64) NOT NULL,
    artifact_id UUID NOT NULL,
    classical_hash VARCHAR(64) NOT NULL,
    post_quantum_hash VARCHAR(128) NOT NULL,
    composite_signature VARCHAR(64) NOT NULL,
    stark_proof VARCHAR(64) NOT NULL,
    policy_hash VARCHAR(64) NOT NULL,
    nonce VARCHAR(64) NOT NULL,
    order_mark VARCHAR(32) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE intelligence.archive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(64) NOT NULL,
    data_category VARCHAR(64) NOT NULL,
    raw_data BYTEA,
    processed_summary TEXT,
    hypervector_fingerprint VARCHAR(128),
    collected_at TIMESTAMPTZ DEFAULT now(),
    attestation_id UUID REFERENCES audit.attestation_chain(id)
);

CREATE TABLE legal.acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_type VARCHAR(64) NOT NULL,
    subject_entity VARCHAR(256) NOT NULL,
    jurisdiction VARCHAR(128),
    content_encrypted BYTEA,
    content_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'draft',
    generated_at TIMESTAMPTZ DEFAULT now(),
    attestation_id UUID REFERENCES audit.attestation_chain(id),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE audit.decision_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(64) NOT NULL,
    actor UUID REFERENCES auth.users(id),
    target_type VARCHAR(64),
    target_id UUID,
    context JSONB,
    entry_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_bica ON auth.users(bica_protocol);
CREATE INDEX idx_attestation_composite ON audit.attestation_chain(composite_signature);
CREATE INDEX idx_archive_source ON intelligence.archive(source);
CREATE INDEX idx_acts_subject ON legal.acts(subject_entity);
CREATE INDEX idx_decision_hash ON audit.decision_log(entry_hash);

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal.acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.attestation_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.decision_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_self ON auth.users FOR ALL
    USING (id = current_setting('app.current_user_id')::UUID OR role IN ('commander', 'omega'));

CREATE POLICY intel_access ON intelligence.archive FOR ALL
    USING (EXISTS (SELECT 1 FROM auth.users WHERE id = current_setting('app.current_user_id')::UUID AND role IN ('operative', 'commander', 'omega')));

CREATE POLICY legal_access ON legal.acts FOR ALL
    USING (EXISTS (SELECT 1 FROM auth.users WHERE id = current_setting('app.current_user_id')::UUID AND role IN ('commander', 'omega')));

INSERT INTO auth.users (bica_protocol, bica_nonce, public_key, role)
VALUES ('a8f3c9d2e1b40571', 'd7Fi84cocpcJ-R1cbjV5U-6QJ', 'sovereign-public-key', 'omega')
ON CONFLICT (bica_protocol) DO NOTHING;
