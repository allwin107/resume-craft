"""Add resume versions table

Revision ID: add_resume_versions
Revises: 
Create Date: 2026-01-28

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


def upgrade():
    # Create resume_versions table
    op.create_table(
        'resume_versions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('latex_content', sa.Text(), nullable=False),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['analysis.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create index for faster lookups
    op.create_index('idx_versions_analysis', 'resume_versions', ['analysis_id'])
    
    # Add unique constraint for version numbers per analysis
    op.create_unique_constraint(
        'uq_analysis_version', 
        'resume_versions', 
        ['analysis_id', 'version_number']
    )


def downgrade():
    op.drop_index('idx_versions_analysis', table_name='resume_versions')
    op.drop_table('resume_versions')
